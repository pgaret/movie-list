import React, { useRef, useState } from 'react';
import { AxiosResponse } from 'axios';
import {
  AppBar,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  Drawer,
  FormControl,
  List,
  ListItemText,
  Menu,
  MenuItem,
  IconButton,
  Toolbar,
  InputLabel,
  Select,
  TextField,
  Typography,
  Card
} from '@material-ui/core';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import MovieList from '../MovieListPage/MovieList/MovieList';
import SideBar from '../MovieListPage/SideBar/SideBar';
import { List as ListInterface } from "lib/interfaces";
import api from "api";
import styles from './MovieListPage.module.scss';

export default function MovieListPage() {
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const [ menuOpen, setMenuOpen ] = useState<boolean>(false);
  const [ lists, setLists ] = useState<Array<ListInterface>>([]);
  const [ selectedList, setSelectedList ] = useState<ListInterface>({ id: '', name: '', userId: '' });
  const [ addListModalOpen, setAddListModalStatus ] = useState<boolean>(false);
  const [ addingList, setAddingList ] = useState<boolean>(false);
  const [ newListName, setNewListName ] = useState<string>('');
  const [ listsLoading, setListsLoading ] = useState<boolean>(true);
  const [ err, setErr ] = useState<string>('');
  const searchRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLButtonElement>(null);

  async function fetchLists(id: string) {
    setListsLoading(true);

    const { data }: AxiosResponse = await api.USERS.LISTS.get(currentUser.id);
    const newList = id ? data.find((list: ListInterface) => list.id === id) : data.length ? data[0] : null;

    setLists(data);
    setListsLoading(false);
    setSelectedList(newList);

    return data;
  }

  React.useEffect(() => {
    fetchLists('');
  }, [setLists]);

  function handleListSelect(id: string) {
    const newSelectedList: ListInterface = lists.find(
        (list: ListInterface) => list.id === id
    ) || lists[0];

    setSelectedList(newSelectedList);
  }

  function toggleAddListModal(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    setAddListModalStatus(!addListModalOpen);
  }

  function handleListNameChange(event: React.ChangeEvent<HTMLInputElement>) {
    setNewListName(event.target.value);
  }

  async function addList () {
    setAddingList(true);

    const { data: { listId, success }} = await api.USERS.LISTS.post(
      currentUser.id,
      { userId: `${currentUser.id}`, name: newListName }
    );

    if (success) {
        fetchLists(listId);
        setAddListModalStatus(false);
        setAddingList(false);
    } else {
        setErr('Did not load lists');
    }
  }

  const addMoveButtonTheme = createMuiTheme({
    palette: {
        secondary: {
            main: 'rgb(45, 152, 70)',
            contrastText: '#fff'
        },
    },
});
  
  return (
    <ThemeProvider theme={addMoveButtonTheme}>
        <div className={styles.movieListPage}>
          <AppBar position="static" className={styles.appBar}>
            <Toolbar className={styles.toolBar}>
              <Typography variant="h6" className={styles.title}>
                MovieChecklist
              </Typography>
              <Button color="inherit">Log Out</Button>
            </Toolbar>
          </AppBar>
              { listsLoading ?
                  <div className={styles.listLoading}>
                      <CircularProgress />
                  </div>
                : (
                    <div className={styles.listSection}>
                      <div className={styles.listSelection}>
                        <FormControl className={styles.form}>
                            <Dialog
                                open={addListModalOpen}
                                onClose={toggleAddListModal}
                                scroll="paper"
                                aria-labelledby="scroll-dialog-title"
                                aria-describedby="scroll-dialog-description"
                            >
                                <DialogTitle id="scroll-dialog-title">
                                    Add New List
                                </DialogTitle>
                                <DialogContent dividers>
                                    <div className={styles.listNameForm}>
                                        { addingList
                                        ? <CircularProgress size="24px" />
                                        : <TextField
                                                id="movie-search-input"
                                                label="Name Your List"
                                                placeholder="Enter list name..."
                                                className={styles.inputField}
                                                ref={searchRef}
                                                onChange={handleListNameChange}
                                            />}
                                    </div>
                                </DialogContent>
                                <DialogActions>
                                    <Button disabled={addingList} onClick={toggleAddListModal} color="primary">
                                        Cancel
                                    </Button>
                                    <Button disabled={addingList} onClick={addList} color="primary">
                                        { addingList? 'Adding...' : 'Add' }
                                    </Button>
                                </DialogActions>
                            </Dialog>
                        </FormControl>
                    </div>
                    <div className={styles.listPageBody}>
                      <SideBar
                        lists={lists}
                        toggleAddListModal={toggleAddListModal}
                        handleListSelect={handleListSelect}
                      />
                      { selectedList && <MovieList list={selectedList} /> }
                    </div>
                  </div>
                )}
          </div>
        </ThemeProvider>

  )
}
