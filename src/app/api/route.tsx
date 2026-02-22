import { stat } from "fs";
import { NextResponse } from "next/server";

export const GET = () => {
  return NextResponse.json
  ({ 
    message: "Hello world" ,
    status:"success"
   });
};
