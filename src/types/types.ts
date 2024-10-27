import { Dispatch, SetStateAction } from "react";

export type CountryPhone = {
    id: string;
    name: string;
    calling_code: string;
    phone_length: string;
    short?: string;
}

export interface CountriesListProps {
    phoneCountry: CountryPhone;
    setPhoneCountry: Dispatch<SetStateAction<CountryPhone>>;
}

export type CallApiProps = {
    endpoint: string,
    method: string,
    params?: Record<string, string>,
    headers?: Record<string, string>,
}

export type ResponseSubmit = {
    phone_number: string;
    country_id: string;
}