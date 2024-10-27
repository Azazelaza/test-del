import { useEffect, useMemo, useRef, useState } from "react";
import { CountriesListProps } from "../../types/types";
import { CallApi } from "../../helper/callApi";

export default function CountriesList({ phoneCountry, setPhoneCountry }: CountriesListProps) {
    const [searchCountry, setSearchCountry] = useState("");
    const [showOptions, setShowOptions] = useState(false);
    const [showOptionsWithFade, setShowOptionsWithFade] = useState(false);

    const [countryPhones, setCountryPhones] = useState(sessionStorage.getItem("countryPhones") ? JSON.parse(sessionStorage.getItem("countryPhones") || "{}") : {});

    const handleShowOptions = () => {
        setShowOptions(!showOptions);
    }

    const getCountryPhones = async () => {
        const countryPhones = await CallApi({
            endpoint: "challenges/countries",
            method: "GET",
        })
        sessionStorage.setItem("countryPhones", JSON.stringify(countryPhones));
        setCountryPhones(countryPhones);
    }

    useEffect(() => {
        getCountryPhones();
    }, [])

    const countriesFiltered = useMemo(() => {
        return Object.keys(countryPhones).filter((option) =>
            countryPhones[option].name.toLowerCase().includes(searchCountry.toLowerCase()) ||
            countryPhones[option].calling_code.includes(searchCountry)
        );
    }, [countryPhones, searchCountry]);

    const countriesContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setSearchCountry("");
    }, [showOptions])

    useEffect(() => {
        if (!showOptions) {
            setTimeout(() => setShowOptionsWithFade(showOptions), 200)
            return
        }
        setTimeout(() => countriesContainerRef.current!.classList.add("fade-in"), 10)
        setShowOptionsWithFade(showOptions)
    }, [showOptions])

    return (
        <>
            <div className="select-country-info" onClick={handleShowOptions}>
                <img
                    src={`https://flagcdn.com/${phoneCountry?.short?.toLowerCase()}.svg`}
                    onError={(e) => e.currentTarget.src = "/non-flag.png"}
                    width={35} height={20} />
                {phoneCountry?.calling_code && <p>{phoneCountry?.calling_code}</p>}
            </div>
            {showOptionsWithFade &&
                <div ref={countriesContainerRef} className={`countries-container ${!showOptions && 'fade-out'}`}>
                    <input
                        type="text"
                        className="input-search"
                        placeholder="Search country"
                        value={searchCountry}
                        onChange={(e) => setSearchCountry(e.target.value)}
                        autoFocus
                    />
                    <div className="countries-list">
                        {countriesFiltered.map((option) => (
                            <div key={option} className="option-country" onClick={() => {
                                setPhoneCountry({ ...countryPhones[option], "short": option })
                                setSearchCountry("")
                                setShowOptions(false)
                            }}>
                                <img
                                    src={`https://flagcdn.com/${option.toLowerCase()}.svg`}
                                    onError={(e) => e.currentTarget.src = "/non-flag.png"}
                                    width={35}
                                    height={20}
                                />
                                <p>{countryPhones[option].name} {countryPhones[option].calling_code}</p>
                            </div>
                        ))}
                        {countriesFiltered.length === 0 && <p className="countries-not-found">No countries found with this name or calling code</p>}
                    </div>
                </div>}
        </>
    )
}
