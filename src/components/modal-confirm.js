import React, {useState} from 'react';
import {Modal} from 'antd';
import OpenNotificationWithIcon from '../components/open-notification-with-icon';
import api from '../services/api';

export default function ModalConfirm({tweet, searchText, visible, closeModal}) {
    const addTweet = async () => {
        try {
            await api.post(`/tweets`, {
                searchText,
                tweet
            });
            OpenNotificationWithIcon('success', 'Tweet adicionado com sucesso.');
            closeModal();
        } catch (e) {
            OpenNotificationWithIcon('error', 'Erro ao adicionar este tweet.');
        }
    };

    return (

        <div>
            {tweet ?
                <Modal
                    title="Tem certeza que desejar exibir este tweet?"
                    visible={visible}
                    onOk={() => addTweet()}
                    onCancel={() => closeModal()}
                >
                    <p>{tweet.text}</p>
                </Modal>
                : null}
        </div>
    );
}
