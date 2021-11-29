import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL, TICKETS, TICKETCOUNT, PROTOCOL } from '../constants';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import LinkIcon from '@mui/icons-material/Link';
import TablePagination from '@mui/material/TablePagination';
import Modal from '@mui/material/Modal';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(theme => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        position: 'absolute',
        width: 450,
        backgroundColor: 'white',
        // boxShadow: theme.
        padding: '1em',
    },
}));

export default function TicketTable() {
    const [page, setPage] = useState(1);
    const [rows, setRows] = useState(null);
    const [count, setCount] = useState(0);
    const [rowsPerPage, ] = useState(25);
    const [ticket, setTicket] = useState(null);

    const classes = useStyles();
    const [modalStyle] = useState({
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
    });

    useEffect((page) => {
        fetchTickets(page);
      }, [page]);

    useEffect((count) => {
    fetchTicketCount(count);
    }, [count]);

    const fetchTicketCount = () => {

        const ticketsURL = `${PROTOCOL}${BASE_URL}${TICKETCOUNT}`;

        axios.get(ticketsURL, {params: {page}})
            .then(response => {
                setCount(response.data.value)
            })
            .catch(e => {
                console.error(e);
            });
    };

    const fetchTickets = () => {

        const ticketsURL = `${PROTOCOL}${BASE_URL}${TICKETS}`;

        axios.get(ticketsURL, {params: {page}})
            .then(response => {
                if(!response.data.length && page!==1){
                    alert("No tickets found, reverting to previous page!")
                    setPage(page-1);
                }
                setRows(response.data);
            })
            .catch(e => {
                console.error(e);
            });
    };

    const iconButton = (url) =>{
    return(<IconButton color="primary" aria-label="Ticket URL" component="span" onClick={() => window.open(url, '_blank')}>
          <LinkIcon />
        </IconButton>);
    }
    
    if(rows){
        return(
            <>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} size="small" >
                    <TableHead>
                    <TableRow>
                        Click on each ticket for more info
                        <TablePagination
                            rowsPerPageOptions={[25]}
                            count={count}
                            rowsPerPage={rowsPerPage}
                            page={page-1}
                            onPageChange={(_e, newPage)=>{setPage(newPage+1)}}
                        />
                    </TableRow>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell align="right">Created At</TableCell>
                        <TableCell align="right">Subject</TableCell>
                        <TableCell align="right">Updated At</TableCell>
                        <TableCell align="right">Status</TableCell>
                        <TableCell align="right">Link</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {rows.map((row) => (
                        <TableRow
                        onClick={()=>{
                            setTicket(row)
                        }}
                        key={row.id}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                        <TableCell component="th" scope="row">
                            {row.id}
                        </TableCell>
                        <TableCell align="right">{row.created_at}</TableCell>
                        <TableCell align="right">{row.subject}</TableCell>
                        <TableCell align="right">{row.updated_at}</TableCell>
                        <TableCell align="right">{row.status}</TableCell>
                        <TableCell align="right">{iconButton(row.url)}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {(!ticket) ? null : 
            <Modal
            open={(ticket!==null)}
            onClose={()=>setTicket(null)}
            >
                <div style={modalStyle} className={classes.paper}>
                    <div>ID: {ticket.id}</div><br/>
                    <div>Type: {ticket.type}</div><br/>
                    <div>Subject: {ticket.subject}</div><br/>
                    <div>Description: {ticket.description}</div><br/>
                    <div>Created at: {ticket.created_at}</div><br/>
                    <div>Updated at: {ticket.updated_at}</div><br/>
                    <div>Status: {ticket.status}</div><br/>
                    <div>Link: {iconButton(ticket.url)}</div><br/>
                    <div>Priority: {ticket.priority}</div><br/>
                </div>
            </Modal>
            }
            </>
        )
    }
    else{
        return (
            <div>Error occured while fetching tickets!</div>
        )
    }
}