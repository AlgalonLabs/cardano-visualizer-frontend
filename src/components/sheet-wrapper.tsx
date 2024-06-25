import {Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger} from "@/components/ui/sheet";
import React from "react";

interface SheetWrapperProps {
    trigger: React.ReactNode;
    title: string;
    children: React.ReactNode;
}

const SheetWrapper: React.FC<SheetWrapperProps> = ({trigger, title, children}) => (
    <Sheet>
        <SheetTrigger asChild>
            {trigger}
        </SheetTrigger>
        <SheetContent className="overflow-y-auto">
            <SheetHeader>
                <SheetTitle className="text-center">{title}</SheetTitle>
            </SheetHeader>
            {children}
        </SheetContent>
    </Sheet>
);

export default SheetWrapper;