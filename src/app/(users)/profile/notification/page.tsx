import { FormButton, LinkButton } from "@/app/components/utils/Button";
import { nextGetServerSession } from "@/lib/authOption";
import prisma from "@/lib/prisma";
import Accept from "./_components/Accept";
import Decline from "./_components/Decline";

export default async function Notification() {
  const session = await nextGetServerSession();
  return (
    <div className="w-screen min-h-screen pt-40 justify-center">
            <div className="flex flex-col w-full">
              <div className="max-w-5xl mx-auto">
                <h1 className="text-2xl text-black mt-56 text-center">Oops! Tidak ada notifikasi apa pun disini</h1>
                <div className="px-52 mt-2">
                  <LinkButton variant="base" href="/profile" className="w-full text-center">
                    Kembali ke Halaman Profil
                  </LinkButton>
                </div>
              </div>
            </div>
    </div>
  );
}
