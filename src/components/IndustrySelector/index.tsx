import { useState, useEffect } from "react";
import AsyncSelect from "react-select/async";
import axios from "axios";
import { useSession } from "next-auth/react";
import Image from "next/image";
import back_arrow from "./../../../public/back_arrow.svg";
import search_icon from "./../../../public/search_icon.svg";
import {
  ActionMeta,
  ControlProps,
  OptionProps,
  StylesConfig,
} from "react-select";
import { ExtendedSession } from "@/types/defaultSession";
import { toast } from "sonner";

const customComponents = {
  Control: ({ children, innerProps }: ControlProps) => (
    <div className="flex items-center relative z-[1] w-full border-[1px] border-[#272938] bg-[#151620] rounded-[10px] cursor-pointer">
      <Image
        src={search_icon}
        width={14}
        height={14}
        alt="search_icon"
        className="absolute left-[10px] text-white z-[1]"
      />
      <div className="flex-1 pl-[32px]" {...innerProps}>
        {children}
      </div>
    </div>
  ),
  DropdownIndicator: () => null,
  IndicatorSeparator: () => null,
};

const IndustrySelector: React.FC<IndustrySelectorProps> = ({
  onSelect,
  selectedIndustries,
}) => {
  const [initialIndustries, setInitialIndustries] = useState([]);

  const { data: session } = useSession() as { data: ExtendedSession };

  useEffect(() => {
    const fetchIndustries = async () => {
      try {
        const response = await axios.get("/api/industries");
        const industries = response?.data?.industries?.map(
          (industry: { id: string | number; name: string }) => ({
            value: industry.id,
            label: industry.name,
          })
        );
        setInitialIndustries(industries);
      } catch (error) {
        console.error("Error loading industries:", error);
      }
    };

    fetchIndustries();
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const customStyles: StylesConfig<any, false> = {
    control: (base, state: { isFocused: boolean }) => ({
      ...base,
      backgroundColor: "#291E5E",
      border: "none",
      boxShadow: state.isFocused ? "0 0 0 2pxrgb(57, 53, 141)" : "none",
      borderRadius: "8px",
      color: "#fff",
      minHeight: "44px",
    }),
    placeholder: (base) => ({
      ...base,
      color: "#AAA",
      paddingLeft: "2px",
    }),
    singleValue: (base) => ({
      ...base,
      color: "#fff",
    }),
    input: (base) => ({
      ...base,
      color: "#fff",
    }),
    menu: (base) => ({
      ...base,
      background:
        "linear-gradient(92.28deg, #342E5E 9.2%, rgba(145, 145, 145, 0.17) 17%, #2A2937 118.31%)",
      backdropFilter: "blur(50px)",
      borderRadius: "0 0 8px 8px",
      fontSize: "15px",
      position: "absolute",
      top: "0",
      paddingTop: "25px",
      zIndex: "0",
    }),
    option: (base, state: { isFocused: boolean }) => ({
      ...base,
      backgroundColor: state.isFocused ? "#443C68" : "transparent",
      borderRadius: "8px",
      color: "#D0CFD1",
      cursor: "pointer",
      paddingLeft: "32px",
    }),
  };

  const loadOptions = async (inputValue: string): Promise<OptionProps[]> => {
    try {
      const response = await axios.get("/api/industries", {
        params: { industryName: inputValue },
      });
      return response.data.industries.map(
        (industry: { id: number; name: string }) => ({
          value: industry.id,
          label: industry.name,
        })
      );
    } catch (error) {
      console.error("Error loading industries:", error);
      return [];
    }
  };

  const handleSelect = async (
    selectedOption: OptionType | null,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    actionMeta: ActionMeta<unknown>
  ) => {
    if (
      selectedOption &&
      !selectedIndustries.some(
        (industry) => industry.value === selectedOption.value
      )
    ) {
      if (selectedIndustries.length === 3) {
        return null;
      }
      onSelect(selectedOption);
      try {
        await axios.post("/api/industries_user", {
          userId: session?.user.id,
          industryId: selectedOption.value,
        });
        toast.success(`Добавлено: ${selectedOption.label}`);
      } catch (error) {
        console.error("Error saving selected industry:", error);
      }
    } else {
      toast.error("Этот элемент уже выбран!");
    }
  };

  const handleRemove = async (industry: {
    value: string | number;
    label: string;
  }) => {
    onSelect(industry, true);
    try {
      await axios.delete("/api/industries_user", {
        data: {
          userId: session?.user.id,
          industryId: industry.value,
        },
      });
      onSelect(industry, true);
      toast.success(`Удалено : ${industry.label}`);
    } catch (error) {
      console.error("Error removing selected industry:", error);
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-[24px]">
        <h1 className="text-xl font-semibold text-[#DDDCD7] text-center text-[22px] flex items-center gap-[14px] leading-[26px]">
          <Image
            src={back_arrow}
            width={18}
            height={16}
            alt="back_arrow"
            className="cursor-pointer"
          />
          Tell us about the industries you work in
        </h1>
        <h2 className="text-sm text-[#AEACB2] text-center text-[16px] ">
          To personalize your experience and increase visibility, <br /> select
          up to 3 industries using the search:
        </h2>
        <div className="bg-[#291E5E] p-[32px] pb-[16.5px] rounded-[15px]">
          <div className="relative">
            <AsyncSelect
              defaultOptions={initialIndustries}
              loadOptions={loadOptions}
              onChange={(newValue, actionMeta) =>
                handleSelect(newValue as OptionType | null, actionMeta)
              }
              isClearable
              isSearchable
              styles={customStyles}
              components={customComponents}
              placeholder="Type an industry name to add"
              value={null}
            />
          </div>
          <div className="px-[16px]" style={{ minHeight: "180px" }}>
            {selectedIndustries.length > 0 && (
              <div>
                <p className="text-xl font-mixed text-[#DDDCD7] text-[16px] mt-[24px] mb-[12px] leading-[26px]">
                  You have selected ({selectedIndustries.length} out of 3):
                </p>
              </div>
            )}
            {selectedIndustries.map((industry: Industry, index: number) => (
              <span
                onClick={() => handleRemove(industry)}
                key={`${industry.value}-${index}`}
                className="inline-flex items-center text-xs font-medium text-[#D0CFD1] text-[15px] rounded-[4px] p-[6.5px] px-[16px] cursor-pointer mr-[12px] mb-[12px] inline-block"
                style={{
                  background:
                    "linear-gradient(269.75deg, #A24AA6 0.16%, rgba(22, 16, 50, 0.81) 103.15%)",
                  border: "0.5px solid #D0CFD1",
                }}
              >
                {industry.label}
              </span>
            ))}
          </div>
          <p className="text-[#676768] text-[15px] px-[16px]">
            {selectedIndustries.length > 0
              ? "Untap to remove."
              : "Please use the search to choose up to 3 industries."}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-center gap-[4px] text-sm font-medium text-gray-900 dark:text-white mt-[13px]">
        <span className="flex w-[6px] h-[6px] rounded-full shrink-0 bg-[#848484] cursor-pointer"></span>
        <span className="flex w-[6px] h-[6px] rounded-full shrink-0 bg-[#848484] cursor-pointer"></span>
        <span
          className="flex w-[6px] h-[6px] rounded-full shrink-0 cursor-pointer"
          style={{ background: "linear-gradient(45deg, #B178DE, #9E3D97)" }}
        ></span>
        <span className="flex w-[6px] h-[6px] rounded-full shrink-0 bg-[#848484] cursor-pointer"></span>
        <span className="flex w-[6px] h-[6px] rounded-full shrink-0 bg-[#848484] cursor-pointer"></span>
      </div>
    </div>
  );
};

export default IndustrySelector;
