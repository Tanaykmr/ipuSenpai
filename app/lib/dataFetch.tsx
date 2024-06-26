'use client'

import {
    RanklistQueryFields,
    RanklistSelectDataFields,
    SearchSelectDataFields,
    StudentResults,
    StudentSearchCard
} from "@/types/types";
import axios from "axios";
import {Dispatch, SetStateAction} from "react";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export async function getProgrammes(): Promise<RanklistQueryFields[]> {
    const res = await axios.get<RanklistQueryFields[]>('/programmes');

    if (res.status !== 200) {
        throw new Error('Failed to fetch data. URL: ' + res.config.url)
    }
    return res.data;
}

export async function getAllInstitutes(): Promise<RanklistQueryFields[]> {
    const res = await axios.get<RanklistQueryFields[]>('/institutes');

    if (res.status !== 200) {
        throw new Error('Failed to fetch data. URL: ' + res.config.url)
    }
    return res.data.map(i => ({name: i.name}));
}


export async function getInstitutes(progname: string): Promise<RanklistQueryFields[]> {
    const res = await axios.get<RanklistQueryFields[]>('/institutes/programme=' + encodeURI(progname));

    if (res.status !== 200) {
        throw new Error('Failed to fetch data. URL: ' + res.config.url)
    }
    return res.data;
}


export async function getSpecs(progname: string, institute: string): Promise<RanklistQueryFields[]> {
    const res = await axios.get<RanklistQueryFields[]>(`/specializations/programme=${encodeURI(progname)}&institute=${encodeURI(institute)}`);

    if (res.status !== 200) {
        throw new Error('Failed to fetch data. URL: ' + res.config.url)
    }
    return res.data;
}


export async function getShifts(institute: string): Promise<RanklistQueryFields[]> {
    const res = await axios.get<RanklistQueryFields[]>(`/institute/shifts/${encodeURI(institute)}`);

    if (res.status !== 200) {
        throw new Error('Failed to fetch data. URL: ' + res.config.url)
    }
    return res.data;
}

export async function getBatches(progname: string, institute: string): Promise<RanklistQueryFields[]> {
    const res = await axios.get<RanklistQueryFields[]>(`/batches/programme=${encodeURI(progname)}&institute=${encodeURI(institute)}`);

    if (res.status !== 200) {
        throw new Error('Failed to fetch data. URL: ' + res.config.url)
    }
    return res.data;
}

export async function getSemesters(progname: string, institute: string, batch: string): Promise<RanklistQueryFields[]> {
    const res = await axios.get<RanklistQueryFields[]>(`/semesters/programme=${encodeURI(progname)}&institute=${encodeURI(institute)}&batch=${encodeURI(batch)}`);

    if (res.status !== 200) {
        throw new Error('Failed to fetch data. URL: ' + res.config.url)
    }
    return [{name: "Overall", value: "0"}, ...res.data];
}

export async function getResult(
    data: RanklistSelectDataFields,
    setPagination: Dispatch<SetStateAction<{
        pageIndex: number;
        pageSize: number;
        totalPages?: number;
    }>>,
    page: number = 0,
    pageSize: number = 50,
): Promise<StudentResults> {

    const url = data.semester !== "0" ?
        `/rank/semester/instcode=${data.shift}&progcode=${data.specialization}&batch=${data.batch}&sem=${data.semester}&pageNumber=${page}&pageSize=${pageSize}/${data.shift === "*" ? encodeURI(data.institute): ""}` :
        `/rank/instcode=${data.shift}&progcode=${data.specialization}&batch=${data.batch}&pageNumber=${page}&pageSize=${pageSize}/${data.shift === "*" ? encodeURI(data.institute) : ""}`

    const res = await axios.get<StudentResults>(url);
    if (res.status !== 200) {
        throw new Error('Failed to fetch data. URL: ' + res.config.url)
    }

    setPagination(prevState => ({...prevState, totalPages: parseInt(res.headers["x-total-page-count"])}))
    return res.data;
}

export async function getSearchByStudentResult(options: SearchSelectDataFields): Promise<StudentSearchCard[]> {
    const url = new URL("/student/search/" + options.name.toUpperCase(), axios.defaults.baseURL);
    if (options.institute !== "All Institutes") url.searchParams.append("institute", options.institute);
    if (options.programme !== "All Programmes") url.searchParams.append("programme", options.programme);
    if (options.batch !== "*") url.searchParams.append("batch", options.batch);


    const res = await axios.get<StudentSearchCard[]>(url.href);
    if (res.status !== 200) {
        throw new Error('Failed to fetch data. URL: ' + res.config.url)
    }

    return res.data;
}

// export async function getStudentProfileData(enrollment: string): Promise<StudentProfileData> {
//     const res = await axios.get<StudentProfileData>(`/student/${enrollment}`);
//
//     if (res.status !== 200) {
//         throw new Error('Failed to fetch data. URL: ' + res.config.url)
//     }
//     console.log(res.data)
//     return res.data;
// }
