'use client'

import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";

type Props = {
    link: string,
    message: string
}

export default function Reproved({ link, message }: Props) {

    return (
        <div>
            <h1>REPROVED</h1>
            {/* <h3>{message}</h3>
            <span>{link}</span> */}
        </div>
    );
}
