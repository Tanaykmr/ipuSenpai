"use client"

import {PreBuiltSelect} from "@/components/ui/select"
import {Input} from "@/components/ui/input"
import {Button} from "@/components/ui/button"
import React, {useEffect, useRef, useState} from "react";
import {RanklistQueryFields, SearchSelectDataFields, StudentSearchCard} from "@/types/types";
import {isMobile} from "@/app/lib/actions";
import {getAllInstitutes, getProgrammes, getSearchByStudentResult} from "@/app/lib/dataFetch";
import {batches} from "@/app/lib/data";
import {useLoader} from "@/app/lib/LoaderContext";
import StudentCard from "@/components/search/StudentCard";

export default function Page() {
    const loader = useLoader();
    const [selectedData, setSelectedData] = useState<SearchSelectDataFields>({
        programme: "All Programmes",
        institute: "All Institutes",
        batch: "*",
        name: "",
    })
    const [programmes, setProgrammes] = useState<RanklistQueryFields[]>([]);
    const [institutes, setInstitutes] = useState<RanklistQueryFields[]>([]);
    const [resultData, setResultData] = useState<StudentSearchCard[]>([]);
    const is_mobile = useRef<boolean>(false);

    useEffect(() => {
        console.log(JSON.stringify(selectedData));
    }, [selectedData]);

    useEffect(() => {
        isMobile()
            .then(value => {
                is_mobile.current = value;
            })
    }, []);

    useEffect(() => {
        const fetchProgrammes = async () => {
            setProgrammes([{name: "All Programmes"}, ...await getProgrammes()]);
            setInstitutes([{name: "All Institutes"}, ...await getAllInstitutes()]);
        }
        fetchProgrammes();
    }, []);

    const handleResultFetch = async () => {
        const resData = await getSearchByStudentResult(selectedData);
        loader.inactiveLoader();
        setResultData(resData);
    }

    return (
        <>
            <form className="lg:px-10 py-4" onSubmit={async (e) => {
                e.preventDefault();
                loader.activeLoader();
                await handleResultFetch();
            }}>
                <div className="rounded-lg mx-4 md:mx-10">
                    <h1 className="text-4xl font-semibold mb-6">Search Student by Name</h1>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-6">
                        <PreBuiltSelect<SearchSelectDataFields>
                            className={""}
                            name={"programme"}
                            // defaultOption={{name: "All Programmes", value: "*"}}
                            values={programmes}
                            valueState={selectedData.programme}
                            setValueState={setSelectedData}
                            disabled={false}
                            is_mobile={is_mobile.current}
                        />
                        <Input
                            value={selectedData.name}
                            className="w-full rounded-2xl md:col-span-2"
                            type="text"
                            required
                            minLength={5}
                            placeholder="Enter student name"
                            onChange={e =>
                                setSelectedData(prevState =>
                                    ({...prevState, name: e.target.value})
                                )}
                        />
                        <Button
                            className=" rounded-2xl focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                            variant={"outline"}
                            // disabled={Object.values(selectedData).some(i => i === "")}

                        >Search</Button>
                    </div>
                    <div className={"my-4"}>Please don&apos;t use this for stalking.</div>
                    <div className={"grid grid-cols-1 md:grid-cols-2 md:grid-rows-2 gap-6"}>
                        <PreBuiltSelect<SearchSelectDataFields>
                            name={"institute"}
                            values={institutes}
                            // defaultOption={{name: "All Institutes", value: "*"}}
                            valueState={selectedData.institute}
                            setValueState={setSelectedData}
                            disabled={institutes.length === 0}
                            is_mobile={is_mobile.current}
                        />
                        <PreBuiltSelect<SearchSelectDataFields>
                            name={"batch"}
                            values={batches}
                            // defaultOption={{name: "All Batches", value: "*"}}
                            valueState={selectedData.batch}
                            setValueState={setSelectedData}
                            disabled={batches.length === 0}
                            is_mobile={is_mobile.current}
                        />
                    </div>

                </div>
            </form>
            <hr />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-10 mx-10 md:mx-20 ">
                {
                    resultData.map((data, idx) =>
                        <StudentCard key={idx + 1} data={data}/>
                    )
                }
            </div>
        </>
    );
}