import React, {useEffect, useState} from 'react';
import {Layout, Input, Empty, Spin, Switch, Space} from 'antd';
import TweetList from '../components/tweet-list'
import api from '../services/api';
import socketIOClient from 'socket.io-client'
import { formatSearchQueryParam } from '../utils/helpers';
const { Search } = Input;

export default function Main({history}) {
    const [tweets, setTweets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [busy, setBusy] = useState(false)
    const [search, setSearch] = useState('globo');
    const [isStream, setIsStream] = useState(false)
    const [currentSocket, setCurrentSocket] = useState(null)

    async function loadTweets() {
        try {
            if (!busy) {
                setLoading(true);
                setBusy(true);
                const q = formatSearchQueryParam(search);
                console.log(q)
                const url = `/tweets-by-text?${q}&count=${100}`;
                const response = await api.get(url);
                setTweets(response.data);
                setLoading(false);
                setBusy(false);
            }
        } catch (e) {
            setTweets([]);
            setLoading(false);
        }
    }

    useEffect(() => {
        loadTweets()
    }, []);

    async function getTweetsByText(value) {
        if (value) {
            setSearch(value)
            if (isStream === false) {
                loadTweets()
            }
        }
    }

    async function handleStream() {
        setIsStream(!isStream)
        if (!isStream) {
            setTweets([])
            startStream()
            setLoading(true)
        } else {
            stopStream()
            setLoading(false)
            // loadTweets()
        }
    }

    async function startStream() {

        console.log('Start stream')
        console.log('search: ', search)
        console.log('socket: ', currentSocket)
        if (search) {
            const q = formatSearchQueryParam(search);
            const socket = socketIOClient(`http://localhost:2020?${q}`);
            console.log('socket: ', socket)
            socket.on('connect', () => {
                console.log("Socket Connected");
                setLoading(true)
                socket.on("tweet", async data => {
                    console.log(tweets.length);
                    let newList = [data].concat(tweets.slice(0, 15))
                    console.log('newList', newList.length)
                    await setTweets(newList);
                });
            });

            socket.on('disconnect', () => {
                socket.off("tweet")
                socket.removeAllListeners("tweet");
                console.log("Socket Disconnected");
            });

            setCurrentSocket(socket);
        }
    }

    async function stopStream() {
        console.log('Parando stream')
        console.log('socket: ', currentSocket)
        if (currentSocket) {
            console.log('Desconectando')
            currentSocket.disconnect()
        }
        setCurrentSocket(null)
    }

    const EmptyResult = (
        <Layout style={{marginTop: '20%', background: '#243447'}}>
            <Empty
                description='Nenhum resultado foi encontrado'
            />
        </Layout>
    )

    return (
        <Layout style={{background: '#243447', alignItems: 'center', justifyContent: 'center'}}>
            <Layout style={{
                background: '#243447',
                width: '100%',
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'space-between'
            }}>
                <Search
                    disabled={isStream}
                    placeholder="Busque tweets por texto ou hashtag. Ex: #globo"
                    onSearch={value => getTweetsByText(value)}
                    onChange={e => getTweetsByText(e.target.value)}
                    style={{width: '50%', height: '50px', marginBottom: '20px', marginTop: '30px', marginLeft: '15%'}}
                />
                <Space style={{marginRight: '15%'}}>
                    <h4 style={{color: '#FFFFFF', marginBottom: '2%'}}>
                        {'Tempo real: '}
                    </h4>
                    <Switch checked={isStream} onChange={() => handleStream()}/>
                </Space>

            </Layout>

            {loading || isStream ? <Spin/> : null}
            <h4 style={{color: '#FFFFFF', marginBottom: '2%'}}>
                {tweets.length > 0 && isStream === false ? tweets.length === 1 ? '1 resultado' : `${tweets.length} resultados` : null}
            </h4>

            {tweets.length > 0 ?
                <TweetList data={tweets} searchText={search}/>
                : loading
                    ? null
                    : EmptyResult
            }
        </Layout>
    )

}
