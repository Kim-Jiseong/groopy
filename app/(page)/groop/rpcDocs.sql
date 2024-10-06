create or replace function search_my_crew(
  p_profile_id bigint,
  search_text text
)
returns table (
  id bigint,
  crew_id bigint,
  profile_id bigint,
  is_deleted boolean,
  is_favorite boolean,
  is_owner boolean,
  created_at timestamp,
  updated_at timestamp,
  published_crew jsonb
) as $$
begin
  return query
  select 
    ec.id,
    ec.crew_id,
    ec.profile_id,
    ec.is_deleted,
    ec.is_favorite,
    ec.is_owner,
    ec.created_at,
    ec.updated_at,
    jsonb_build_object(
      'id', p.id,
      'crew_id', p.crew_id,
      'name', p.name,
      'tags', p.tags,
      'description', p.description,
      'greeting', p.greeting,
      'status', p.status,
      'created_at', p.created_at,
      'updated_at', p.updated_at
    ) as published_crew
  from employed_crew ec
  left join lateral (
    select p.*
    from published_crew p
    where p.crew_id = ec.crew_id
      and p.is_deleted = false
    order by p.id desc -- 가장 큰 id 값을 가진 레코드를 선택
    limit 1
  ) p on true
  where ec.profile_id = p_profile_id
    and ec.is_owner = false
    and ec.is_deleted = false
    and p.id is not null -- 최신 published_crew가 있는 경우에만 포함
    and (
      search_text = ''
      or (
        (p.name is not null and p.name ILIKE '%' || search_text || '%')
        or (p.tags is not null and p.tags @> ARRAY[search_text])
        or (p.description is not null and p.description ILIKE '%' || search_text || '%')
        or (p.greeting is not null and p.greeting ILIKE '%' || search_text || '%')
      )
    )
  order by
    (
      coalesce((case when p.name ILIKE '%' || search_text || '%' then 3 else 0 end), 0) +
      coalesce((case when p.tags @> ARRAY[search_text] then 2 else 0 end), 0) +
      coalesce((case when p.description ILIKE '%' || search_text || '%' then 1 else 0 end), 0) +
      coalesce((case when p.greeting ILIKE '%' || search_text || '%' then 0.5 else 0 end), 0)
    ) desc,
    p.updated_at desc nulls last;
end
$$ language plpgsql;
