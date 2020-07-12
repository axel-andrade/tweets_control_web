import React, {useState, useEffect} from 'react';
import {Avatar, List, Space, Layout, Button} from 'antd';
import {FundProjectionScreenOutlined, RetweetOutlined, HeartFilled} from '@ant-design/icons';
import {formatDate} from '../utils/helpers';
import ModalConfirm from './modal-confirm';
import {
    CSSTransition,
    TransitionGroup,
} from 'react-transition-group';

const {Footer} = Layout;

export default function TweetList({data, searchText, removeTweetOfList}) {
    const [openModal, setOpenModal] = useState(false);
    const [tweetSelected, setTweetSelected] = useState(null);

    async function closeModal(id) {
        setTweetSelected(null);
        setOpenModal(false);
        if(id){
            removeTweetOfList(id)
        }
    }

    async function handleOpenModal(item) {
        setTweetSelected(item);
        setOpenModal(true);
    }

    return (
        <div>
            <ModalConfirm
                tweet={tweetSelected}
                searchText={searchText}
                visible={openModal}
                closeModal={closeModal}
            />
            <TransitionGroup>
            {data.map((item, index) => (
                <CSSTransition
                    key={item.id}
                    timeout={500}
                    classNames="item"
                >
                    <Layout style={{width: '800',marginBottom: '5%'}}>
                        <List.Item
                            className="remove-btn"
                            key={item.id_str}
                            style={{marginTop: 10, marginBottom: 10, marginLeft: 20}}
                            onClick={() => handleOpenModal(item)}
                        >
                            <List.Item.Meta
                                style={{marginBottom: '2%'}}
                                avatar={<Avatar src={item.user.profile_image_url} size={40}/>}
                                title={<a href={item.href}>{`${item.user.screen_name}`}</a>}
                                description={item.user.name}
                            />
                            {item.text}
                            {new Date(item.created_at).toDateString}
                        </List.Item>

                        <Footer style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between'}}>
                            <Space>
                                <HeartFilled size={50} style={{color: 'red'}}/>
                                {item.favorite_count}
                                <RetweetOutlined size={50} style={{color: '#85C1E9'}}/>
                                {item.retweet_count}
                                {formatDate(new Date(item.created_at))}
                            </Space>
                            <Layout style={{width: '100%', alignItems: 'center', paddingTop: 10}}>
                                <Button style={{width: '30%', backgroundColor: '#3498DB'}}
                                        onClick={() => handleOpenModal(item)}>
                                    <FundProjectionScreenOutlined size={50} style={{color: 'white'}}/>
                                </Button>
                            </Layout>
                        </Footer>
                    </Layout>
                </CSSTransition>
            ))}
            </TransitionGroup>
        </div>
    );
}
