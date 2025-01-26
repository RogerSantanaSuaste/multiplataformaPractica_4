import React, { useEffect, useState } from "react";
//import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
interface Pokemon {
    name: string;
    url: string;
}

interface PokemonDetails {
    id: number;
    name: string;
    sprites: { other: { 'official-artwork': { front_default: string } } };
    types: { type: { name: string } }[];
}

interface PokemonStored {
    id: number;
    name: string;
    sprite: string;
    types: { type: { name: string } }[];
}


const Pokecard: React.FC = () => {
    const [pokemons, setPokemons] = useState<PokemonDetails[]>([]);
    const [loading, setLoading] = useState<Boolean>(false);
    const [error, setError] = useState<String | null>(null);
    const [selectedPokemon, setSelectedPokemon] = useState<PokemonStored | null>(null);

    useEffect(() => {
        try {
            const storedPokemon = localStorage.getItem("selectedPokemon");
            if (storedPokemon) {
                setSelectedPokemon(JSON.parse(storedPokemon)); // Parse only if data exists
            }
        } catch (error) {
            console.error("Failed to parse selected Pokémon from localStorage:", error);
            setSelectedPokemon(null); // Reset to null if there's an error
        }
    }, []);

    useEffect(() => {
        const fetchPokemon = async () => {
            try {
                setLoading(true);
                const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=10");
                if (!response.ok) {
                    throw new Error("NO HAY POKEMON, DIOS MIO LA OPERACION FALLO.");
                }
                const data = await response.json();
                const detailedPromises = data.results.map(async (pokemon: Pokemon) => {
                    const detailResponse = await fetch(pokemon.url);
                    if (!detailResponse.ok) {
                        throw new Error(`Fallo al intentar recuperar datos del pokemon: ${pokemon.name}`);
                    }
                    return detailResponse.json();
                });
                const detailedPokemon = await Promise.all(detailedPromises);
                setPokemons(detailedPokemon);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchPokemon();
    }, []);

    if (loading) {
        return <p> Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>
    }
    const SelectButton: React.FC<{ pokemon: PokemonDetails }> = ({ pokemon }) => {
        const handleSelectPokemon = () => {
            // objeto para saber que estamos haciendo
            const selectedPokemonType = {
                id: pokemon.id,
                name: pokemon.name,
                types: pokemon.types.map((typeObj) => typeObj.type.name),
                sprite: pokemon.sprites.other["official-artwork"].front_default,
            };

            // qyue miedao
            localStorage.setItem("selectedPokemon", JSON.stringify(selectedPokemonType));


            // LogsAreLove
            console.log("Pokemon saved:", selectedPokemonType);
            // @ts-ignore
            setSelectedPokemon(selectedPokemonType);
        };

        return (
            <button className="btn btn-primary" onClick={handleSelectPokemon}>
                Seleccionar Pokemon
            </button>
        );
    }


    return (
        <>
        {selectedPokemon && (
                    <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3 d-flex justify-content-center m-1">
                    <div className="card mb-3 m-2 p-2 pokeStyle text-center">
                        <h2>Selected Pokémon</h2>
                        
                        <img
                            src={/* @ts-ignore*/
                                selectedPokemon.sprite}
                            alt={selectedPokemon.name}
                            className="img-fluid width-5 height-5"
                        />
                        
                        <h3 className="text-uppercase">{selectedPokemon.name}</h3>
                        <p>Types:</p>
                        <ul className="text-uppercase listsHate">
                            {selectedPokemon.types.map((type, index) => (
                                // @ts-ignore
                                <li key={index}>{type}</li>
                            ))}
                        </ul>
                    </div>
                    </div>

                )}
            <div className="container">
                <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3 d-flex justify-content-center">

                    {pokemons.map((pokemon) => (
                        <div key={pokemon.id} className="card mb-3 m-2 p-2 pokeStyle ">
                            <div className="row g-0">
                                <div className="col-md-4">
                                    <img
                                        src={pokemon.sprites.other["official-artwork"].front_default}
                                        alt={pokemon.name}
                                        className="img-fluid rounded-start"
                                    />
                                </div>
                                <div className="col-md-8">
                                    <div className="card-body">
                                        <h3 className="card-title text-uppercase">{pokemon.name}</h3>
                                        <p className="card-text">Types:</p>
                                        <ul className="">
                                            {pokemon.types.map((typeObj, index) => (
                                                <li key={index} className=" text-uppercase">
                                                    {typeObj.type.name}
                                                </li>
                                            ))}
                                        </ul>
                                        <SelectButton pokemon={pokemon}></SelectButton>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                
            </div>
        </>
    );

};


export default Pokecard;