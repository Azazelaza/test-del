import { useEffect, useState, useCallback, useRef } from "react";
import "../../sass/components/TwoFactor.scss";
import { CallApi } from "../../helper/callApi";
import CountriesList from "../layout/CountriesList";
import { CountryPhone, ResponseSubmit } from "../../types/types";

export default function TwoFactor() {
    const phoneNumberRef = useRef<HTMLInputElement>(null);

    const [phoneCountry, setPhoneCountry] = useState<CountryPhone>({
        "id": "3",
        "name": "United States",
        "calling_code": "+1",
        "phone_length": "10",
        "short": "US"
    });
    const [isLoading, setIsLoading] = useState(false);

    const [phoneNumber, setPhoneNumber] = useState("");
    const [error, setError] = useState("");
    const [response, setResponse] = useState<ResponseSubmit | null>(null);

    const validatePhoneNumber = useCallback((number: string) => {
        const formatted = formatToPhone(number);
        setPhoneNumber(formatted || "");
    }, [phoneCountry.phone_length]);

    const changePhoneNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (error) {
            setError("");
            phoneNumberRef.current!.classList.remove("error");
        }
        const formatted = formatToPhone(e.target.value.replace(/\D/g, ''));
        setPhoneNumber(formatted || "");
    }

    const formatToPhone = (number: string) => {
        const input = number.replace(/\D/g, '').substring(0, Number(phoneCountry.phone_length));
        const areaCode = input.substring(0, 3);
        const middle = input.substring(3, 6);
        const last = input.substring(6, Number(phoneCountry.phone_length));

        if (input.length > 6) return `(${areaCode}) ${middle} - ${last}`;
        if (input.length > 3) return `(${areaCode}) ${middle}`;
        if (input.length > 0) return `(${areaCode}`;
    };


    const handleSubmit = async () => {
        const formatted = phoneNumber.replace(/\D/g, '').substring(0, Number(phoneCountry.phone_length));
        if (!formatted || formatted.length < Number(phoneCountry.phone_length)) {
            phoneNumberRef.current!.classList.add("error");
            setError("The phone number is invalid");
            return;
        }

        setIsLoading(true);
        const response = await CallApi({
            endpoint: "challenges/two_factor_auth",
            method: "POST",
            params: {
                phone_number: phoneNumber.replace(/\D/g, '').substring(0, Number(phoneCountry.phone_length)),
                country_id: phoneCountry.id
            }
        })
        setResponse(response);
        setIsLoading(false);
    }

    useEffect(() => {
        validatePhoneNumber(phoneNumber);
    }, [phoneCountry]);

    return (
        <>
            <div className="form-phone">
                <div className="country-phones">
                    <div className="select-country">
                        <CountriesList
                            phoneCountry={phoneCountry}
                            setPhoneCountry={setPhoneCountry}
                        />
                    </div>
                    <div className="input-phone-container">
                        <input ref={phoneNumberRef} className="input-phone" type="text" value={phoneNumber} onChange={changePhoneNumber} placeholder="(000) 000 - 0000" />
                        {error && <small className="error-message">{error}</small>}
                    </div>
                </div>
                <button className="btn-submit" disabled={isLoading} onClick={handleSubmit}>{isLoading ? "Loading..." : "Submit"}</button>
            </div>

            {response && (
                <>
                    <div className="response-api">
                        <h2>Response</h2>
                        <p>{JSON.stringify(response)}</p>
                    </div>
                </>
            )}
        </>
    )
}
