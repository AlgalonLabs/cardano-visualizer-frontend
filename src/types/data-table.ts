import {CellContext} from "@tanstack/react-table";
import React from "react";

export type CellType<T> = string | ((props: CellContext<T, unknown>) => React.ReactNode);
