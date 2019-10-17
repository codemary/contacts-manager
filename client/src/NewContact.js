import React, { Component } from 'react';
import {
    Form,
    Input,
    Button,
    Row
} from 'antd';

import './NewContact.css';

import { createContact } from './api';

class ContactForm extends Component {
    state = {
        createContactErr: null
    }

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                createContact(values).then(() => {
                    this.props.hideModal(true);
                }).catch(err => {
                    this.setState({ createContactErr: err.message })
                })
            }
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form;

        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 16,
                    offset: 8,
                },
            },
        };

        return (
            <Form {...formItemLayout} onSubmit={this.handleSubmit} className="newcontact-form">
                <Form.Item>
                    {this.state.createContactErr}
                </Form.Item>
                <Form.Item label="Name">
                    {getFieldDecorator('name', {
                        rules: [
                            {
                                required: true,
                                message: 'Please input contact name!',
                            },
                        ],
                    })(<Input />)}
                </Form.Item>
                <Form.Item
                    label={
                        <span>
                            Email&nbsp;
              </span>
                    }
                >
                    {getFieldDecorator('email', {
                        rules: [{ type: 'email', message: 'Please input contact email!' }],
                    })(<Input />)}
                </Form.Item>

                <Form.Item
                    label={
                        <span>
                            City&nbsp;
              </span>
                    }
                >
                    {getFieldDecorator('city', {
                        rules: [{ maxLen: 30, message: 'Please input contact city!' }],
                    })(<Input />)}
                </Form.Item>

                <Form.Item
                    label={
                        <span>
                            Phone&nbsp;
              </span>
                    }
                >
                    {getFieldDecorator('phone', {
                        rules: [{ maxLen: 9, message: 'Please input contact phone!' }],
                    })(<Input />)}
                </Form.Item>

                <Form.Item {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit">
                        Create Contact
            </Button>
                </Form.Item>
            </Form>
        );
    }
}

const NewContact = Form.create({ name: 'newContact' })(ContactForm);

export default NewContact;