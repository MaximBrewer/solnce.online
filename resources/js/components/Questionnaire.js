import React, { useState } from 'react';
import axios from "axios";
import moment from "moment";
import { Button, Modal, Form, Row, Col, ButtonToolbar } from 'react-bootstrap';
import InputMask from 'react-input-mask';
import Thumb from './Thumb.js';
import DatePicker from "./react-date-picker";
import ru from 'date-fns/locale/ru';
import { Formik } from 'formik';
import ImageUploader from './ImageUploader.js';
import * as Yup from 'Yup';


export default function Questionnaire() {

    const [loading, setLoading] = React.useState(false)

    const schema = Yup.object({
        fcs: Yup.string().min(3).required(),
        email: Yup.string().email().required(),
        phone: Yup.string().matches(/([\+0-9\(\)\-]{16})/, { excludeEmptyString: true }).required(),
        birthdate: Yup.string().matches(/([0-9\/]*)/, { excludeEmptyString: true }).required(),
        region: Yup.string().min(3).required(),
        education: Yup.string().min(3).required(),
        directrion: Yup.string().min(3).required(),
        description: Yup.string().min(3).required(),
        link: Yup.string().min(3).required()
    });

    const [showThanks, setShowThanks] = useState(false);
    const handleCloseThanks = () => setShowThanks(false);
    const handleShowThanks = () => setShowThanks(true);
    const [defaultPictures, setDefaultPictures] = useState([]);
    const [pictures, setPictures] = useState([]);
    const [xhrErrors, setXhrErrors] = useState({});

    const onDrop = (images, set) => {
        setPictures([images.pop()])
        setXhrErrors({})
    }

    const CustomInput = React.forwardRef((props, ref) => {
        return (
            <input
                className={props.classes}
                onClick={props.onClick}
                value={props.value}
                type="text"
                name="birthdate_input"
                readOnly={true}
                ref={ref}
            />
        )
    })

    const sendForm = (formdata, { resetForm }) => {
        setXhrErrors({})
        const data = new FormData();
        for (var key in formdata) {
            if (key == 'birthdate')
                data.append(key, document.getElementsByName('birthdate_input')[0].value);
            else
                data.append(key, formdata[key]);
        }
        setLoading(true)
        data.append('photo', document.getElementsByName('photo_upload')[0].files[0]);
        axios
            .post('/questionnaire', data)
            .then(function (res) {
                setShowThanks(true)
                resetForm();
                setDefaultPictures([])
                setLoading(false)
            }).catch(function (err) {
                if (!!err.response && !!err.response.data && !!err.response.data.errors)
                    setXhrErrors(err.response.data.errors)
                setLoading(false)
            })
    }

    return (
        <section>
            <div className="container">
                <div className="substrate">
                    <h2 className="section-title font-libre">{window.__('Questionnaire')}</h2>
                    <Formik
                        validationSchema={schema}
                        onSubmit={sendForm}
                        initialValues={{
                            fcs: '',
                            email: '',
                            phone: '',
                            birthdate: '',
                            region: '',
                            education: '',
                            directrion: '',
                            description: '',
                            link: ''
                        }}
                    >
                        {({
                            handleSubmit,
                            handleChange,
                            setFieldValue,
                            handleBlur,
                            values,
                            touched,
                            isValid,
                            errors,
                        }) => (
                                <Form noValidate onSubmit={handleSubmit}>
                                    <Form.Group as={Row} controlId="formFCS">
                                        <Form.Label column md="3" className="text-nowrap">{window.__('FCS')}</Form.Label>
                                        <Col md="9">
                                            <Form.Control type="text" placeholder={window.__('FCS (in full)')} value={values.fcs} name="fcs" onChange={handleChange} isValid={touched.fcs && !errors.fcs} isInvalid={touched.fcs && !!errors.fcs} />
                                        </Col>
                                    </Form.Group>
                                    <Form.Group controlId="formBasicEmail" as={Row}>
                                        <Form.Label column md="3" className="text-nowrap">{window.__('E-mail')}</Form.Label>
                                        <Col md="9">
                                            <Form.Control type="email" name="email" placeholder={window.__('E-mail')} value={values.email} onChange={handleChange} isValid={touched.email && !errors.email} isInvalid={touched.email && !!errors.email} />
                                        </Col>
                                        {/* <Form.Text className="text-muted">{window.__('We\'ll never share your email with anyone else.')}</Form.Text> */}
                                    </Form.Group>
                                    <Form.Group controlId="formPhone" as={Row}>
                                        <Form.Label column md="3" className="text-nowrap">{window.__('Phone')}</Form.Label>
                                        <Col md="9">
                                            <InputMask mask="+7(999)999-99-99" maskChar=" " className={!touched.phone ? "form-control" : touched.phone && !errors.phone ? "form-control is-valid" : "form-control is-invalid"} placeholder={window.__('Phone')} onChange={handleChange} value={values.phone} name="phone" />
                                        </Col>
                                    </Form.Group>
                                    <Form.Group controlId="formBirthdate" as={Row}>
                                        <Form.Label column md="3" className="text-nowrap">{window.__('Date of Birth')}</Form.Label>
                                        <Col md="9">
                                            <DatePicker

                                                onChange={e => setFieldValue('birthdate', e)}
                                                format="dd.MM.yyyy"
                                                required={true}
                                                name="birthdate"
                                                value={values.birthdate}
                                            />
                                            {/* <DatePicker
                                                customInput={<CustomInput classes={!touched.birthdate ? "form-control" : touched.birthdate && !errors.birthdate ? "form-control is-valid" : "form-control is-invalid"} />}
                                                selected={values.birthdate}
                                                locale="ru"
                                                onChange={e => setFieldValue('birthdate', e)}
                                            /> */}
                                        </Col>
                                    </Form.Group>
                                    <Form.Group controlId="formRegion" as={Row}>
                                        <Form.Label column md="3" className="text-nowrap">{window.__('Region')}</Form.Label>
                                        <Col md="9">
                                            <Form.Control name="region" type="text" placeholder={window.__('Region')} value={values.region} onChange={handleChange} isValid={touched.region && !errors.region} isInvalid={touched.region && !!errors.region} />
                                        </Col>
                                    </Form.Group>
                                    <Form.Group controlId="formEducation" as={Row}>
                                        <Form.Label column md="3" className="text-nowrap">{window.__('Education')}</Form.Label>
                                        <Col md="9">
                                            <Form.Control name="education" type="text" placeholder={window.__('Education')} value={values.education} onChange={handleChange} isValid={touched.education && !errors.education} isInvalid={touched.education && !!errors.education} />
                                        </Col>
                                    </Form.Group>
                                    <Form.Group controlId="formDirectrion" as={Row}>
                                        <Form.Label column md="3" className="text-nowrap">{window.__('Direction')}</Form.Label>
                                        <Col md="9">
                                            <Form.Control name="directrion" type="text" placeholder={window.__('Direction of activity')} value={values.directrion} onChange={handleChange} isValid={touched.directrion && !errors.directrion} isInvalid={touched.directrion && !!errors.directrion} />
                                        </Col>
                                    </Form.Group>
                                    <Form.Group controlId="formDescription" as={Row}>
                                        <Form.Label column md="3" className="text-nowrap">{window.__('Description')}</Form.Label>
                                        <Col md="9">
                                            <Form.Control name="description" type="text" placeholder={window.__('Description of the activity')} value={values.description} onChange={handleChange} isValid={touched.description && !errors.description} isInvalid={touched.description && !!errors.description} />
                                        </Col>
                                    </Form.Group>
                                    <Form.Group controlId="formLink" as={Row}>
                                        <Form.Label column md="3" className="text-nowrap">{window.__('Link')}</Form.Label>
                                        <Col md="9">
                                            <Form.Control name="link" type="text" placeholder={window.__('Link to information resources')} value={values.link} onChange={handleChange} isValid={touched.link && !errors.link} isInvalid={touched.link && !!errors.link} />
                                        </Col>
                                    </Form.Group>
                                    <Form.Group controlId="formPhoto" as={Row}>
                                        <Form.Label column md="3" className="text-nowrap">{window.__('Photo')}</Form.Label>
                                        <Col md="9">
                                            <ImageUploader
                                                withIcon={true}
                                                buttonText={window.__('Choose photo')}
                                                onChange={onDrop}
                                                imgExtension={['.jpg', '.gif', '.png', '.gif']}
                                                maxFileSize={5242880}
                                                withPreview={true}
                                                defaultImages={defaultPictures}
                                                singleImage={true}
                                                errorClass="is-invalid"
                                                label={window.__('Photo (can be attached as a separate file)')}
                                                name="photo_upload"
                                            />
                                            <Form.Text className={!!xhrErrors.photo ? 'errors text-right' : 'd-none'}>{window.__('Photo is required!')}</Form.Text>
                                        </Col>
                                    </Form.Group>
                                    <div className="text-right">
                                        <Button variant="primary" type="submit">{window.__('Send')}</Button>
                                    </div>
                                </Form>
                            )}
                    </Formik>
                </div>
            </div>
            <Modal show={showThanks} tabIndex="-1" onHide={handleCloseThanks}>
                <Modal.Header closeButton>
                    <Modal.Title>{window.__('Thanks you!')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h3>{window.__('Thanks for your order!')}<br />{window.__('We will contact you!')}</h3>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleCloseThanks}>{window.__('Close')}</Button>
                </Modal.Footer>
            </Modal>
        </section>
    );
}


