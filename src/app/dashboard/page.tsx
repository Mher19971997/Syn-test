"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import IndustrySelector from "@/components/IndustrySelector";
import Navbar from "@/components/Navbar";
import Card from "@/components/ui/Card";
import withAuth from "@/hook/withAuth";
import axios from "axios";

interface Industry {
  value: string | number;
  label: string;
}

function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [selectedIndustries, setSelectedIndustries] = useState<Industry[]>([]);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/login");
      return;
    }

    const fetchIndustries = async () => {
      try {
        const response = await axios.get("/api/industries_user", {
          params: { userId: (session.user as { id: string }).id },
        });
        const loadedIndustries = response.data.selectedIndustries.map(
          (item: { industry: { id: number; name: string } }) => {
            return {
              value: item.industry.id,
              label: item.industry.name,
            };
          }
        );
        setSelectedIndustries(loadedIndustries);
      } catch (error) {
        console.error(error);
      }
    };

    fetchIndustries();
  }, [status, session, router]);

  const handleIndustrySelect = (industryObj: Industry, remove = false) => {
    setSelectedIndustries((prev) => {
      if (remove) {
        return prev.filter((item) => item.value !== industryObj.value);
      } else {
        return [...prev, industryObj];
      }
    });
  };

  const handleContinue = () => {
    console.log("// Дальнейшая логика");
  };

  if (status === "loading") {
    return <div>Загрузка...</div>;
  }

  if (!session) {
    return null;
  }

  return (
    <div>
      <Navbar />
      <div className="flex justify-center items-center min-h-screen">
        <Card>
          <IndustrySelector
            onSelect={handleIndustrySelect}
            selectedIndustries={selectedIndustries}
          />
          <div className="flex justify-center mt-[24px]">
            <button
              onClick={handleContinue}
              disabled={selectedIndustries.length === 0}
              className={`text-white font-medium text-[16px]  p-[13.5px] px-auto rounded cursor-pointer ${
                selectedIndustries.length === 0
                  ? "cursor-not-allowed opacity-70"
                  : "hover:bg-[#5C3BA3]"
              } w-[336px] rounded-[15px] ${
                selectedIndustries.length === 0
                  ? "bg-[#404045]"
                  : "bg-[#6B46C1]"
              }`}
            >
              Continue
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default withAuth(DashboardPage);
