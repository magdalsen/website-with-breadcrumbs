import { createContext, Dispatch, SetStateAction, useEffect, useState } from "react";

import { MovieData } from "../components/TableData/TableData";

import { getSafeContext } from "./getSafeContext";
const token = import.meta.env.VITE_TOKEN

export interface CollectionData {
  belongs_to_collection: {
      id: number;
      name: string;
      poster_path: string;
      backdrop_path: string;
  },
  budget: number;
  genres: {
    id: number;
    name: string;
  }[],
  production_companies: [{
    name: string;
  }]
  production_countries: [{
    name: string;
  }]
  status: string;
}

type TableContextProps={
  movies: MovieData[];
  setCollection: (collection:CollectionData)=>void;
  setCurrentMovieId: (currentMovieId:number | undefined)=>void;
  coll: CollectionData | undefined;
  currentMovieId: number | undefined;
  setPage: Dispatch<SetStateAction<number>>;
  page: number;
}

export const TableContext=createContext<TableContextProps|null>(null)

export const TableProvider = ({ children }: { children: React.ReactNode }) => {
    const [movies, setMovies] = useState<MovieData[]>([]);
    const [coll, returnCollection] = useState<CollectionData>();
    const [currentMovieId, returnCurrentMovieId] = useState<number | undefined>(undefined);
    const [page, setPage] = useState<number>(1);
    
    const fetchData = () => {
        const options = {
          method: 'GET',
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${token}`
          }
        };
        
        fetch(`https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${page}&sort_by=popularity.desc`, options)
          .then(response => response.json())
          .then(response => {
            setMovies(response.results);
          })
          .catch(err => <>Sorry, error occured: {err}</>);
    };

    const setCollection = (collection:CollectionData) => {
      returnCollection(collection);
    }

    const setCurrentMovieId = (currentMovieId:number | undefined) => {
      returnCurrentMovieId(currentMovieId);
    }

    useEffect(()=>{
        page === null || page >= 500 || page <= 0 ? '' : fetchData();
    }, [page]);

    return (
      <TableContext.Provider value={{ movies, setCollection, setCurrentMovieId, setPage, page, coll, currentMovieId }}>
        {children}
      </TableContext.Provider>
    );
  };

  export const useTableContext = getSafeContext(TableContext, "tableContext")