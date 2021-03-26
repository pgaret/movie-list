import React from 'react';
import { AxiosResponse } from 'axios';
import { CircularProgress, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import { List } from "lib/interfaces";
import api from "api";
import styles from './MovieListPage.module.scss';
import MovieList from './MovieList/MovieList';

export default function MovieListPage() {
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const [ lists, setLists ] = React.useState<Array<List>>([]);
    const [ selectedList, setSelectedList ] = React.useState<List>({ id: '', name: '', userId: '' });
    const [ listsLoading, setListsLoading ] = React.useState<Boolean>(true)

    React.useEffect(() => {
        function fetchLists() {
            api.USERS.LISTS.get(currentUser.id)
            .then((res: AxiosResponse) => {
                setLists(res.data);
                setSelectedList(res.data[0]);
                setListsLoading(false);
            });
    }
      fetchLists();
    }, [setLists]);

    function handleListSelect(e: React.ChangeEvent<{ value: unknown }>) {
        console.log(e);
    }

    return (
        <div className={styles.movieListPage}>
            <h1>Movie Checklist</h1>
            { listsLoading ?
                <div className={styles.listLoading}>
                    <CircularProgress />
                </div>
                : <div className={styles.listSection}>
                    <div className={styles.listSelection}>
                        <FormControl>
                            <InputLabel id="select-a-list-label">Your Lists</InputLabel>
                            <Select
                                id="select-a-list"
                                labelId="select-a-list-label"
                                value={selectedList.id}
                                onChange={handleListSelect}
                            >
                                { lists.map((list) => <MenuItem value={list.id}>{list.name}</MenuItem>) }
                            </Select>
                        </FormControl>
                    </div>
                    <MovieList list={selectedList} />
                </div>
            }

        </div>
    )
}
