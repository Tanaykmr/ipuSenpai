"use client"

import * as React from "react"
import {useEffect, useState} from "react"
import {Moon, Sun} from "lucide-react"
import {useTheme} from "next-themes"

import {Button} from "@/components/ui/button"
import {useMuiTheme} from "@/app/lib/MUIThemeProvider";

export function ThemeToggle() {
    const {setTheme, theme} = useTheme()
    const [themeModeDark, setThemeModeDark] = useState(theme === "first");
    const setMuiTheme = useMuiTheme();

    useEffect(() => {
        console.log(theme)
        setTheme(themeModeDark ? "first" : "second");
        setMuiTheme(themeModeDark ? "dark" : "light");
    }, [setTheme, themeModeDark]);

    return (
        <Button
            variant="outline"
            className={"rounded-full"}
            size="icon"
            onClick={() => setThemeModeDark(prev => !prev)}
        >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"/>
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"/>

        </Button>

    )
}
