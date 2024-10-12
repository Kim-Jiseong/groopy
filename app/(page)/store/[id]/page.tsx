import MarkdownRenderer from "@/components/common/MarkdownRenderer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getCrewInfoByID } from "@/service/crew/action";
import { Users } from "lucide-react";
import React from "react";
import Image from "next/image";
import { formatDateTime } from "@/utils/formatTime";
import { getMyProfile } from "@/service/profile/action";
import HireBtn from "./components/hireBtn";
import { getEmployedCrewListByProfileId } from "@/service/employed_crew/action";
import SignInBtn from "./components/signInBtn";

type Props = {
  params: {
    id: string;
  };
};

async function StoreDetailPage({ params }: Props) {
  const groop = await getCrewInfoByID(params.id);
  const auth = await getMyProfile();

  if (!groop) return;
  else
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="lg:flex lg:space-x-8">
          {/* 모바일 뷰 */}
          <div className="lg:hidden space-y-8">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <Image
                    src={
                      groop.image ||
                      "https://vufqadhpxvvugtkaeyjx.supabase.co/storage/v1/object/public/assets/image/default_user.webp?t=2024-10-03T10%3A47%3A19.027Z"
                    }
                    alt={`${groop.name} profile`}
                    width={80}
                    height={80}
                    className="rounded-full"
                  />
                  <div>
                    <CardTitle className="text-2xl font-bold">
                      {groop.name}
                    </CardTitle>
                    <p className="text-muted-foreground text-sm">
                      {groop.description}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center space-x-2 text-muted-foreground">
                  <Users size={20} />
                  <span>{groop.usage} users</span>
                </div>
              </CardContent>
              <CardFooter>
                {auth?.profile ? (
                  <HireBtn profile={auth.profile} crewInfo={groop} />
                ) : (
                  <SignInBtn />
                )}
              </CardFooter>
            </Card>

            {groop.detail && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-bold"></CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm dark:prose-invert">
                    <MarkdownRenderer content={groop.detail} />
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <p className="text-sm text-center py-4 px-2">
                Last Update: {formatDateTime(groop.updated_at)}
              </p>
            </Card>
          </div>

          {/* PC 뷰 */}
          <div className="hidden lg:block lg:w-1/3">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <Image
                    src={
                      groop.image ||
                      "https://vufqadhpxvvugtkaeyjx.supabase.co/storage/v1/object/public/assets/image/default_user.webp?t=2024-10-03T10%3A47%3A19.027Z"
                    }
                    alt={`${groop.name} 프로필`}
                    width={200}
                    height={200}
                    className="rounded-full mb-4"
                  />
                  <h2 className="text-3xl font-bold mb-2">{groop.name}</h2>
                  <p className="text-muted-foreground mb-4">
                    {groop.description}
                  </p>
                  <div className="flex items-center justify-center space-x-2 text-muted-foreground mb-6">
                    <Users size={20} />
                    <span>{groop.usage} users</span>
                  </div>
                  {auth?.profile ? (
                    <HireBtn profile={auth.profile} crewInfo={groop} />
                  ) : (
                    <SignInBtn />
                  )}
                </div>
              </CardContent>
              <CardFooter className="bg-muted p-6">
                <p className="text-sm text-center w-full">
                  Last Update: {formatDateTime(groop.updated_at)}
                </p>
              </CardFooter>
            </Card>
          </div>

          {groop.detail && (
            <div className="hidden lg:flex lg:flex-col lg:w-2/3 space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-bold"></CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-lg dark:prose-invert">
                    <MarkdownRenderer content={groop.detail} />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    );
}

export default StoreDetailPage;
