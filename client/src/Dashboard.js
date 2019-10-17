import React, { Component } from 'react';
import { List, Row, Col, Button, Modal, Icon, Popconfirm} from 'antd';
import { currentUser, fetchContacts, deleteContact } from './api';
import NewContact from './NewContact';

class Dashboard extends Component {

    state = {
        contacts: [],
        showErr: null,
        modalVisible: false,
    }

    hideModal = (load) => {
        if(load){
            this.loadData()
        }
        this.setState({ modalVisible: false })
    } 
    
    loadData = () => {
        fetchContacts().then((contacts) => {
            this.setState({ contacts });
        }).catch(err => {
            this.setState({ showErr: err.message })
            console.log(err)
        })
    }

    removeContact = (id) => {
        deleteContact(id).then((res) => {
            this.loadData()
        }).catch(err => {
            this.setState({ showErr: err.message })
            console.log(err)
        })
    }
    

    componentDidMount() {
        if (!currentUser()) {
            this.props.history.push("/login")
            return;
        }

        this.loadData()
    }

    render() {
        return (
            <Row type="flex" justify="center">
                <Col xs={12}>
                    <List
                        header={
                            <Row type="flex" justify="space-between" gutter={16}>
                                <Col xs={16}>
                                    <h3> Contacts {this.state.showErr} </h3>
                                </Col>
                                <Col>
                                    <Button type="primary" icon="plus"
                                        onClick={() => this.setState({ modalVisible: true })} />
                                </Col>
                            </Row>
                        }
                        bordered
                        dataSource={this.state.contacts}
                        renderItem={item => (
                            <List.Item  actions={[
                                <Popconfirm
                                title="Are you sure delete this contact?"
                                onConfirm={() => this.removeContact(item._id)}
                                
                                okText="Yes"
                                cancelText="No"
                              >
                                 <Icon type="delete" key="delete" />
                              </Popconfirm>
                              ]}>
                                {item.name}
                            </List.Item>
                        )}
                    />
                </Col>
                <Modal
                    title="New Contact"
                    centered
                    visible={this.state.modalVisible}
                    footer={null}
                    onCancel={() => this.hideModal(false)}>
                    <NewContact hideModal={this.hideModal}/>
                </Modal>
            </Row>
        );
    }
}

export default Dashboard;