import React, { useEffect, useState } from "react";
//import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
interface Pokemon {
    name: string;
    url: string;
}

interface PokemonDetails {
    id: number;
    name: string;
    sprites: { other: { 'official-artwork': {front_default: string} } };
    types: { type: { name: string } }[];
}
const Pokecard: React.FC = () => {
    const [pokemons, setPokemons] = useState<PokemonDetails[]>([]);
    const [loading, setLoading] = useState<Boolean>(false);
    const [error, setError] = useState<String | null>(null);

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
                        throw new Error(`Failed to fetch details for ${pokemon.name}`);
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
    return (
        <>
            <div className="container">
                <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">

                    {pokemons.map((pokemon) => (
                        <div key={pokemon.id} className="card mb-3 m-2 p-2 pokeStyle">
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
                                        <h3 className="card-title">{pokemon.name}</h3>
                                        <p className="card-text">Types:</p>
                                        <ul className="">
                                            {pokemon.types.map((typeObj, index) => (
                                                <li key={index} className="">
                                                    {typeObj.type.name}
                                                </li>
                                            ))}
                                        </ul>
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