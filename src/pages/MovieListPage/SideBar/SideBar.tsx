import React from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import List from '@material-ui/core/List';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import DoneOutlineIcon from '@material-ui/icons/DoneOutline';

import { List as ListInterface } from 'lib/interfaces';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    top: 64
  }
}));

interface SideBarProps {
    lists: ListInterface[],
    toggleAddListModal: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void,
    handleListSelect: (id: string) => void
}

export default function PersistentDrawerLeft({ lists, toggleAddListModal, handleListSelect }: SideBarProps) {
  const classes = useStyles();
  const theme = useTheme();

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={true}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <List>
            <ListItem button key="title">
                <ListItemText primary="Your Lists" />
                <Button variant="contained" color="secondary" onClick={toggleAddListModal}>
                    Add List
                </Button>
            </ListItem>
        </List>
        <Divider />
        <List>
          {lists.map((list: ListInterface) => (
            <ListItem button key={list.id}>
              <ListItemText primary={list.name} onClick={() => handleListSelect(list.id)} />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </div>
  );
}
