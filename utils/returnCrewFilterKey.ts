export const returnCrewFilterKey = (filter: string) => {
    switch (filter) {
        case "latest":
            return "updated_at"
        case "popular":
            return "usage"
        case "trending":
            return "view_count"
        default:
            return "updated_at"
    }
}