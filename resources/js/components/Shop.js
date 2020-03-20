import React, { useState, useEffect } from 'react';
import axios from "axios";
import { css } from "@emotion/core";
import { ClipLoader, CircleLoader, BounceLoader, BeatLoader } from "react-spinners";
import { Button, Modal } from 'react-bootstrap';
import InputMask from 'react-input-mask';

// Can be a string as well. Need to ensure each key-value pair ends with ;
const override = css`
  display: block;
  position:
  margin: 0 auto;
  border-color: red;
`;



export default function Shop() {

    const [seedlings, setSeedlings] = React.useState([]);
    const [cart, setCart] = React.useState({
        items: []
    });
    const [loading, setLoading] = React.useState(false)
    const [seedling, setSeedling] = React.useState({})
    const [errors, setErrors] = React.useState({})
    const [showCart, setShowCart] = useState(false);
    const [showThanks, setShowThanks] = useState(false);
    const [showSeedling, setShowSeedling] = useState(false);
    const [formname, setFormname] = useState('');
    const [formphone, setFormphone] = useState('');


    const handleCloseSeedling = () => setShowSeedling(false);
    const handleShowSeedling = () => setShowSeedling(true);


    const handleCloseCart = () => setShowCart(false);
    const handleShowCart = () => setShowCart(true);

    const handleCloseThanks = () => setShowThanks(false);
    const handleShowThanks = () => setShowThanks(true);


    useEffect(() => {
        axios.get('/cart/getSeedling')
            .then(function (res) {
                setCart({
                    items: res.data
                })
            })
        axios.get('/seedlings')
            .then(function (res) {
                const sedList = [];
                for (let i in res.data.data) {
                    let s = res.data.data[i]
                    sedList.push(
                        <div className="col-xl-3 col-md-4 col-sm-6" key={s.id}>
                            <div className="page-item">
                                <a href="#" onClick={(e) => openSeedling(s, e)}>
                                    <div className="page-item-photo">
                                        <div className="zooming"><img src={s.image} alt={s.title} /></div>
                                    </div>
                                    <div className="page-item-title">{s.title}</div>
                                </a>
                                <form onSubmit={(e) => addToCart(s, e)}>
                                    <div className="page-item-buy btn-group input-group">
                                        <input type="number" className="form-control" defaultValue={1} onChange={(e) => { s.quantity = 1 * e.target.value }} />
                                        <button className="btn btn-success js-btn-buy" type="submit">{window.__("Buy")}</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )
                }
                setSeedlings(sedList)
            })
    }, []);

    const sendForm = (e) => {
        e.preventDefault();
        setLoading(true)
        axios
            .patch('/cart/order', { name: formname, phone: formphone })
            .then(function (res) {
                setCart({
                    items: res.data
                })
                setShowCart(false)
                setShowThanks(true)
                setLoading(false)
            }).catch(function (err) {
                setErrors(err.response.data.errors)
                setLoading(false)
            })
    }

    const openSeedling = (s, e) => {
        e.preventDefault();
        setLoading(true)
        axios
            .get('/seedlings/' + s.id)
            .then(function (res) {
                setSeedling(res.data.data)
                setShowSeedling(true)
                setLoading(false)
            })
    }

    const addToCart = (s, e) => {
        e.preventDefault()
        setLoading(true)
        s.quantity = !!s.quantity ? s.quantity : 1;
        axios
            .post('/cart/addSeedling', { id: s.id, quantity: s.quantity })
            .then(function (res) {
                setCart({
                    items: res.data
                })
                setShowCart(true)
                setLoading(false)
            })
    }

    const removeFromCart = (s, e) => {
        e.preventDefault();
        setLoading(true)
        axios
            .delete('/cart/removeSeedling/' + s.id)
            .then(function (res) {
                setCart({
                    items: res.data
                })
                setLoading(false)
            })
    }

    let list = [];
    for (let i in cart.items) {
        let j = cart.items[i]
        list.push(<tr key={i}>
            <th scope="row">
                <div className="p-2">
                    {/* <img
          src=""
          alt
          width="70"
          className="img-fluid rounded shadow-sm"
          /> */}
                    <div className="ml-3 d-inline-block align-middle">
                        <h5 className="mb-0">{j.name}</h5>
                    </div>
                </div>
            </th>
            <td className="align-middle text-center">
                <strong>{j.price}₽</strong>
            </td>
            <td className="align-middle text-center">
                <strong>{j.quantity}</strong>
            </td>
            <td className="align-middle text-center">
                <a href="#" onClick={(e) => removeFromCart(j, e)}>
                    <i className="fa fa-trash"></i>
                </a>
            </td>
        </tr>)
    }

    return (
        <section>
            <div className={loading ? "sweet-loading" : "d-none"}>
                <BeatLoader
                    css={override}
                    size={20}
                    margin={3}
                    color={"#35551c"}
                    loading={loading}
                />
            </div>
            <Button variant="primary" onClick={handleShowCart} id="shopping-cart-link" className="sidebar-affix">
                <i className="fa fa-shopping-cart" aria-hidden="true"></i>
                <i className={!!list.length ? "cnt" : "cnt d-none"}>{list.length}</i>
            </Button>
            <Modal show={showCart} tabIndex="-1" size="lg" onHide={handleCloseCart}>
                <Modal.Header closeButton>
                    <Modal.Title><i className="fa fa-shopping-cart" aria-hidden="true"></i> {window.__('Cart')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                        <div className="col-lg-12">
                            <div className={!!list.length ? "table-responsive" : "d-none"}>
                                <table className="table table-sm table-dark rounded border-0">
                                    <thead>
                                        <tr>
                                            <th scope="col" className="border-0">
                                                <div className="p-2 px-3">{window.__('Seedling')}</div>
                                            </th>
                                            <th scope="col" className="text-center border-0">
                                                <div className="py-2">{window.__('Price')}</div>
                                            </th>
                                            <th scope="col" className="text-center border-0">
                                                <div className="py-2">{window.__('Quantity')}</div>
                                            </th>
                                            <th scope="col" className="text-center border-0">
                                                <div className="py-2">{window.__('Remove')}</div>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {list}
                                    </tbody>
                                </table>
                            </div>
                            <div className={!list.length ? "table-responsive" : "d-none"}>
                                <h3 className="text-center">{window.__('Cart is empty!')}</h3>
                            </div>
                        </div>
                    </div>
                    <div className={!!list.length ? "row" : "d-none"}>
                        <div className="col-lg-12">
                            <div className="form-group">
                                <input type="text" className={!!errors.name ? "is-invalid form-control" : "form-control"} placeholder={window.__('Name')} onChange={(e) => { setFormname(e.target.value) }} title={errors.name} value={formname} />
                            </div>
                            <div className="form-group">
                                <InputMask mask="+7(999)999-99-99" maskChar=" " className={!!errors.phone ? "is-invalid form-control" : "form-control"} placeholder={window.__('Phone')} onChange={(e) => { setFormphone(e.target.value) }} title={errors.phone} value={formphone} />
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseCart}>{window.__('Back')}</Button>
                    <Button variant="primary" onClick={sendForm} className={!!list.length ? "" : "d-none"}>{window.__('Send order')}</Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showSeedling} tabIndex="-1" size="lg" onHide={handleCloseSeedling}>
                <Modal.Header closeButton>
                    <Modal.Title>{seedling.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <img src={seedling.image} alt={seedling.title} />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseSeedling}>{window.__('Close')}</Button>
                    <Button variant="primary">{window.__('Add to cart')}</Button>
                </Modal.Footer>
            </Modal>
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
            <div className="container">
                <div className="substrate">
                    <div className="row">
                        <div className="col-lg-12">
                            <h2 className="section-title font-libre">Купить дерево</h2>
                        </div>
                    </div>
                    <div className="row">
                        {seedlings}
                    </div>
                </div>
            </div>
        </section >
    );
}


