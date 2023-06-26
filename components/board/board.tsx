/* Libraries */
import React, { Fragment, useContext, useState } from 'react';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { Button, Card, Chip, IconButton, Paper, TextField, Tooltip } from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { useRouter } from 'next/router';

/* Components */
import ComponentBoardCard from './card';
import { CardInterface, batchUpdateIndexAndState, createNewCard } from '../api/api';
import { AppContext } from '../context/context';

/* Styles */
import styles from "@/styles/board.module.scss";
import { AxiosError } from 'axios';
import ComponentNewBoardModal from './newBoardModal';

const newCardDefaultValues = {
    index: -1,
    title: ""
};



const ComponentBoard = () => {
    const { cards, setCards, getAllCards, boards, cardFilter } = useContext(AppContext);
    const [newCard, setNewCard] = useState<{ index: number, title: string }>(newCardDefaultValues);
    
    const [isNewBoardModalVisible, setIsNewBoardModalVisible] = useState<boolean>(false);

    const router = useRouter();
    const { boardid } = router.query;

    const cardFilterCondition = (card: CardInterface) => {
        if (cardFilter === "ALL")
            return true;

        if (cardFilter.some(cf => cf === "UNASSIGNED") && card.assignedTo.length === 0)
            return true;

        return card.assignedTo.some(user => cardFilter.some(cf => cf === user._id));
    }

    const onDragEnd = (result: any, _cards: any, _setCards: any) => {
        if (!result.destination) return;

        const { source, destination } = result;
        let rawSourceItems = [..._cards[source.droppableId].items] as Array<CardInterface>;
        let rawDestItems = [..._cards[destination.droppableId].items] as Array<CardInterface>;
        let filterSourceItems = [...rawSourceItems.filter((card: CardInterface) => { return cardFilterCondition(card) })] as Array<CardInterface>;
        let filterDestItems = [...rawDestItems.filter((card: CardInterface) => { return cardFilterCondition(card) })] as Array<CardInterface>;

        if (typeof boardid !== 'string') return;
        if (source.droppableId !== destination.droppableId) {
            let [removed] = filterSourceItems.splice(source.index, 1);
            removed.state = destination.droppableId;
            rawSourceItems.splice(rawSourceItems.findIndex(e => e._id === removed._id), 1);

            if (destination.index == 0)
                rawDestItems.splice(0, 0, removed);
            else if (destination.index == filterDestItems.length)
                rawDestItems.splice(rawDestItems.length, 0, removed);
            else {
                let ind = rawDestItems.findIndex((e: CardInterface) => e._id === filterDestItems[destination.index]._id);
                rawDestItems.splice(ind, 0, removed);
            }

            rawDestItems = rawDestItems.map((e: any, index: number) => { e.index = index; return e; })
            const batch = rawDestItems.map((e: CardInterface, index: number) => { return { index: index, cardId: e._id, state: e.state, previousSource: index == destination.index ? source.droppableId : destination.droppableId, destinationSource: destination.droppableId } });
            batchUpdateIndexAndState(batch).then(() => {
                getAllCards();
            }).catch((error: AxiosError) => {
                console.warn(error);
            });

            _setCards({
                ..._cards,
                [source.droppableId]: {
                    ..._cards[source.droppableId],
                    items: rawSourceItems,
                },
                [destination.droppableId]: {
                    ..._cards[destination.droppableId],
                    items: rawDestItems,
                },
            });
        } else {
            const [removed] = filterSourceItems.splice(source.index, 1);
            rawSourceItems.splice(rawSourceItems.findIndex(e => removed._id === e._id), 1);
            rawSourceItems.splice(destination.index, 0, removed);
            rawSourceItems = rawSourceItems.map((e: any, index: number) => { e.index = index; return e; })
            batchUpdateIndexAndState(rawSourceItems.map((e: CardInterface, index: number) => { return { index: index, cardId: e._id, state: e.state, previousSource: source.droppableId, destinationSource: destination.droppableId } })).then(result => {
                getAllCards();
            }).catch((error: AxiosError) => {
                console.warn(error);
            })

            _setCards({
                ..._cards,
                [source.droppableId]: {
                    ..._cards[source.droppableId],
                    items: rawSourceItems,
                },
            });
        }
    };

    if (boards.length == 0) {
        return (
            <Fragment>
                <Card className={`${styles.noBoardsContainer} flex flex-col justify-center items-center w-[95%] h-[95%] self-center justify-self-center bg-[#e4e4e4e7]`}>
                    <button onClick={() => { setIsNewBoardModalVisible(true); }} className='flex flex-col sm:aspect-square w-fit max-w-[90%] justify-center items-center border-black border-4 border-dashed rounded-xl p-8 bg-transparent hover:scale-105 transition-transform cursor-pointer'>
                        <img className='h-80 object-contain' src='/not-found.png' alt="Not found icon"></img>
                        <span className='text-xl'>No boards found!</span>
                        <span className='text-xl'><span className='font-bold'>Click here</span> to create one</span>
                    </button>
                </Card>
                <ComponentNewBoardModal isModalVisible={isNewBoardModalVisible} setIsModalVisible={setIsNewBoardModalVisible} />
            </Fragment>
        );
    }

    if (typeof boardid !== 'string' || boardid.length < 4) {
        return null;
    }

    return (
        <DragDropContext
            onDragEnd={(result) => onDragEnd(result, cards, setCards)}
        >
            <div className={`${styles.boardContainer} flex h-full overflow-x-scroll max-w-full`}>
                {Object.entries(cards).map(([columnId, column], index) => {
                    return (
                        <Paper key={columnId} className={`${column.paperStyle} flex flex-col my-4 h-fit min-h-[calc(100%-40px)] ${index == 0 ? "ml-4 mr-2" : "mx-2"} w-full min-w-[240px] max-w-[320px] rounded-xl px-2 pt-4 bg-[#e4e4e4e7]`} elevation={3}>
                            <div className='flex flex-col h-min px-2'>
                                <div className='flex'>
                                    <span className='text-xl font-bold'>{column.title}</span>
                                    <Chip className='ml-auto' label={column.items.length}></Chip>
                                </div>
                                <Tooltip title="Add new card">
                                    <Button
                                        onClick={() => { setNewCard({ index: index, title: "" }); }}
                                        className='my-4'
                                        style={{ backgroundColor: "#e8eaed" }}
                                        color="warning"
                                        variant='contained'>
                                        <AddRoundedIcon htmlColor='gray' />
                                    </Button>
                                </Tooltip>
                            </div>

                            {
                                index == newCard.index &&
                                <Fragment>
                                    <Card elevation={2} className='mx-2 my-2 flex flex-col px-2 py-2 text-sm border-[1px]'>
                                        <TextField
                                            label="Enter a title for this card..."
                                            variant='standard'
                                            value={newCard.title}
                                            onChange={e => { setNewCard({ ...newCard, title: e.target.value }); }}
                                        ></TextField>
                                    </Card>
                                    <div className='flex mx-2 mb-8 text-sm'>
                                        <Button
                                            onClick={() => {
                                                if (newCard.title.length == 0 || typeof boardid !== "string") return;
                                                createNewCard({
                                                    title: newCard.title,
                                                    description: "",
                                                    boardId: boardid,
                                                    state: columnId
                                                }).then(createResult => {
                                                    setNewCard(newCardDefaultValues);
                                                    getAllCards();
                                                }).catch((error: AxiosError) => {
                                                    console.warn(error);
                                                });
                                            }}
                                            variant='contained'
                                            className='mr-2'>Create</Button>
                                        <IconButton onClick={() => { setNewCard(newCardDefaultValues); }}>
                                            <CloseRoundedIcon />
                                        </IconButton>
                                    </div>
                                </Fragment>
                            }

                            <Droppable key={columnId} droppableId={columnId}>
                                {(provided) => (
                                    <div className='flex flex-col flex-1' ref={provided.innerRef} {...provided.droppableProps}>
                                        {column.items.filter(card => { return cardFilterCondition(card) }).sort((a, b) => a.index - b.index).map((item: any, index) => (
                                            <ComponentBoardCard key={item._id} item={item} index={index} />
                                        ))}
                                    </div>
                                )}
                            </Droppable>
                        </Paper>
                    );
                })}
            </div>
        </DragDropContext>
    );
};

export default ComponentBoard;