import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import React from "react";

export const PageNavigation = () => {
    return (
        <Pagination className="my-8 rounded-[6px]">
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious className="rounded-[10px]" href="#" />
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink className="rounded-[10px]" href="#">
                        1
                    </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                    <PaginationNext className="rounded-[10px]" href="#" />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
};
