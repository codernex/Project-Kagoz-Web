import { cn } from "@/lib/utils";
import { axiosInstance } from "@/redux/api";
import React, { useEffect, useState } from "react";

const SvgInline: React.FC<{ url: string, className?: string }> = ({ url, className }) => {
    const [svgContent, setSvgContent] = useState("");

    useEffect(() => {
        const fetchSvg = async () => {
            try {
                const response = await axiosInstance.get(url)
                const svgText = await response.data;
                setSvgContent(svgText);
            } catch (error) {
                console.error("Error fetching SVG:", error);
            }
        };

        fetchSvg();
    }, [url]);

    return (
        <div
            className={cn('h-8 w-8 flex items-center justify-center cursor-pointer', className)}
            dangerouslySetInnerHTML={{ __html: svgContent }} // Optional styling
        />
    );
};

export default SvgInline;