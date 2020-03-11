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



export default function Seedlings(props) {

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
        let sedList = [];
        for (let i in props.ss) {
            let s = props.ss[i]
            sedList.push(
                <tr key={s.id}>
                    <td>{s.title}</td>
                    <td>{s.beginning_fruiting}</td>
                    <td>{s.fruiting}</td>
                    <td>{s.fruiting}</td>
                    <td>{s.fruit_price}</td>
                    <td>{s.season}</td>
                    <td className="min-rem-8">
                        <form onSubmit={(e) => addToCart(s, e)}>
                            <div className="page-item-buy btn-group input-group input-group-sm btn-group-sm flex-nowrap">
                                <input type="number" className="form-control" defaultValue={1} onChange={(e) => { s.quantity = 1 * e.target.value }} />
                                <button className="btn btn-success js-btn-buy" type="submit">{window.__("Buy")}</button>
                            </div>
                        </form>
                    </td>
                </tr>
            )
        }
        setSeedlings(sedList)
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
        s.quantity = !!s.quantity ? s.quantity : 1;
        axios
            .post('/cart/addSeedling', { id: s.id, quantity: s.quantity })
            .then(function (res) {
                setCart({
                    items: res.data
                })
                setShowCart(true)
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
            <a onClick={handleShowCart} id="shopping-cart-link" className="sidebar-affix" href="javascript:void(0)">
                <i className="fa fa-shopping-cart" aria-hidden="true"></i>
                <i className={!!list.length ? "cnt" : "cnt d-none"}>{list.length}</i>
            </a>
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
                            <h2 className="section-title font-libre">{window.__('Купить дерево')}</h2>
                        </div>
                    </div>
                    <div className="row">
                        <div className="table-responsive">
                            <table className="table table-sm table-bordered text-center">
                                <thead>
                                    <tr>
                                        <th rowSpan="2">{window.__('Culture')}</th>
                                        <th>{window.__('Beginning of fruiting')}</th>
                                        <th>{window.__('Commercial fruiting')}</th>
                                        <th>{window.__('3')}</th>
                                        <th>{window.__('Price range')}</th>
                                        <th rowSpan="2">{window.__('Months of fruiting')}</th>
                                        <th rowSpan="2"></th>
                                    </tr>
                                    <tr>
                                        <th>{window.__('from 1 year to 3 years')}</th>
                                        <th>{window.__('from 3 years old')}</th>
                                        <th>{window.__('from 8 years old')}</th>
                                        <th>{window.__('CCC cost')}</th>
                                    </tr></thead>
                                <tbody>
                                    {seedlings}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </section >
    );
}


