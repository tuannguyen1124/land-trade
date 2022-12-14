import React, { useState, useEffect } from "react";
import { initTransactionRequest } from "./action";
import { connect } from "react-redux";
import formatCurrency from "../../utils/formatCurrency";
import axios from "axios";
import Cookie from "../../helper/cookie";
import { Link } from "react-router-dom";
import Steps from "./steps";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

function Init(props) {
  const [depositPrice, setDepositPrice] = useState("");
  const [transferPrice, setTransferPrice] = useState("");
  const [depositTime, setDepositTime] = useState(60);
  const [saleItem, setSaleItem] = useState(props.saleItem);
  const [buyers, setBuyers] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  // useEffect(() => {
  //   // listen event TransactionCreated from blockchain and emit event INIT_TRANSACTION_SUCCESS
  //   props.transactionContract &&
  //     props.transactionContract.events
  //       .TransactionCreated()
  //       .on("data", (event) => {
  //         props.initTransactionSuccess({
  //           history: props.history,
  //           txHash: event.transactionHash,
  //         });
  //       })
  //       .on("error", console.error);
  // }, [props.transactionContract]);

  const fetchPropertyTrading = async (transactionHash) => {
    const response = await axios({
      method: "GET",
      url: `${process.env.REACT_APP_BASE_URL_API}/certification/${transactionHash}`,
      headers: {
        Authorization: `Bearer ${Cookie.getCookie("accessToken")}`,
      },
    });
    return response.data.data;
  };

  useEffect(() => {
    if (!saleItem) {
      (async () => {
        const response = await fetchPropertyTrading(
          props.match.params.transactionHash
        );
        setSaleItem(response);
      })();
    }
  }, []);

  useEffect(() => {
    if (saleItem) {
      setTransferPrice(formatCurrency(saleItem.moreInfo.price));
      setDepositPrice(formatCurrency(saleItem.moreInfo.price * 0.3));
      (async () => {
        const [buyersInfo, sellersInfo] = await getParticipantsInfo(
          [props.user["publicAddress"]],
          saleItem.owners
        );
        setBuyers(buyersInfo);
        setSellers(sellersInfo);
      })();
    }
  }, [saleItem]);

  // get all user infor from publicAddress
  const getUserProfile = async (publicAddress) => {
    const response = await axios({
      method: "GET",
      url: `${process.env.REACT_APP_BASE_URL_API}/users/${publicAddress}`,
      headers: {
        Authorization: `Bearer ${Cookie.getCookie("accessToken")}`,
      },
    });
    return response.data.data;
  };

  const getParticipantsInfo = async (buyers, sellers) => {
    const promises1 = buyers.map((publicAddress) =>
      getUserProfile(publicAddress)
    );
    const promises2 = sellers.map((publicAddress) =>
      getUserProfile(publicAddress)
    );
    return Promise.all([Promise.all(promises1), Promise.all(promises2)]);
  };

  return !saleItem || !props.user ? (
    <div className="container mt-75">
      <h4 className="text-center">
        {" "}
        Vui l??ng ????ng nh???p ????? ti???p t???c s??? d???ng t??nh n??ng n??y
      </h4>
    </div>
  ) : (
    <div className="container mt-75">
      <div className="row">
        <div className="col-md-4">
          <Steps />
        </div>
        <div className="col-md-8">
          <div className="row">
            <div className="col-md-6 col-sm-12">
              <h6>T??i s???n</h6>
              <div className="single-property-box">
                {/* <div className="property-item">
                  <Link
                    className="property-img"
                    to={`property/${saleItem.transactionHash}`}
                  >
                    <img
                      src={`${process.env.REACT_APP_BASE_URL_IMAGE}/images/${saleItem.images[0]}`}
                      alt="#"
                    />
                  </Link>
                </div> */}
                <div className="property-title-box">
                  <h4>
                    <Link to={`property/${saleItem.transactionHash}`}>
                      {saleItem.moreInfo.title}
                    </Link>
                  </h4>
                  <div className="property-location">
                    <i className="fa fa-map-marker-alt"></i>
                    <p>{saleItem.properties.landLot.address}</p>
                  </div>
                  <div className="trend-open mt-10">
                    <p> {formatCurrency(saleItem.moreInfo.price)} </p>
                  </div>
                  <ul className="property-feature">
                    <li>
                      {" "}
                      <i className="fas fa-bed"></i>
                      <span>{saleItem.moreInfo.numOfBedrooms} ph??ng ng???</span>
                    </li>
                    <li>
                      {" "}
                      <i className="fas fa-bath"></i>
                      <span>
                        {saleItem.moreInfo.numOfBathrooms} ph??ng v??? sinh
                      </span>
                    </li>
                    <li>
                      {" "}
                      <i className="fas fa-arrows-alt"></i>
                      <span>{saleItem.moreInfo.areaFloor} m2</span>
                    </li>
                    <li>
                      {" "}
                      <i className="fas fa-car"></i>
                      <span>{saleItem.moreInfo.utilities.length} ti???n ??ch</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-sm-12">
              <div className="form-group">
                <h6>S??? ti???n ?????t c???c</h6>
                <div className="row">
                  <div className="input-group">
                    <input
                      name="depositPrice"
                      component="input"
                      type="text"
                      className="form-control filter-input"
                      placeholder="S??? ti???n ?????t c???c"
                      value={depositPrice}
                      onChange={(e) => {
                        setDepositPrice(formatCurrency(e.target.value));
                      }}
                    />
                    <div className="input-group-append">
                      <span className="input-group-text"> VND </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="form-group">
                <h6>Gi?? mua</h6>
                <div className="row">
                  <div className="input-group">
                    <input
                      name="price"
                      component="input"
                      type="text"
                      className="form-control filter-input"
                      placeholder="Gi?? mua"
                      value={transferPrice}
                      onChange={(e) => {
                        setTransferPrice(formatCurrency(e.target.value));
                      }}
                    />
                    <div className="input-group-append">
                      <span className="input-group-text"> VND </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="form-group">
                <h6>Th???i gian ?????t c???c</h6>
                <div className="row">
                  <div className="input-group">
                    <input
                      name="price"
                      component="input"
                      type="text"
                      className="form-control filter-input"
                      placeholder="Gi?? mua"
                      value={depositTime}
                      onChange={(e) => {
                        setDepositTime(e.target.value);
                      }}
                    />
                    <div className="input-group-append">
                      <span className="input-group-text"> Ng??y </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <h6>B??n b??n</h6>
          <div>
            {sellers.map((owner, index) => (
              <div className="agent-details" key={index}>
                <ul className="address-list">
                  <li>
                    <span>H??? t??n :</span>
                    {owner.fullName}
                  </li>
                  <li>
                    <span>Email:</span>
                    {owner.email}
                  </li>
                  <li>
                    <span>SDT:</span>
                    {owner.phoneNumber}
                  </li>
                </ul>
              </div>
            ))}
          </div>
          <br />
          <h6>B??n mua</h6>
          <div>
            <div className="agent-details">
              <ul className="address-list">
                <li>
                  <span>H??? t??n :</span>
                  {props.user.fullName}
                </li>
                <li>
                  <span>Email:</span>
                  {props.user.email}
                </li>
                <li>
                  <span>SDT:</span>
                  {props.user.phoneNumber}
                </li>
              </ul>
            </div>
          </div>

          <button
            disabled={props.loading}
            className="btn v3"
            onClick={handleClickOpen}
          >
            G???i y??u c???u ?????t c???c
          </button>

          <Dialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={open}
          >
            <DialogTitle id="customized-dialog-title" onClose={handleClose}>
              X??c nh???n g???i y??u c???u ?????t c???c
            </DialogTitle>
            <DialogContent dividers>
              <ul className="address-list">
                <li>
                  <span>Gi?? tr??? giao d???ch:</span>
                  {transferPrice} VN??
                </li>
                <li>
                  <span>S??? ti???n c???n ?????t c???c:</span>
                  {depositPrice} VN??
                </li>
                <li>
                  <span>Th???i gian ?????t c???c:</span>
                  {depositTime} Ng??y
                </li>
              </ul>
              <h6>L??u ??</h6>
              <ul className="address-list">
                <li>
                  Khi b???n x??c nh???n ?????t c???c giao d???ch n??y, b???n c?? th??? h???y giao
                  dich v?? nh???n l???i ti???n ?????t c???c khi ng?????i b??n ch??a ch???p nh???n
                  giao d???ch!
                </li>
              </ul>
            </DialogContent>
            <DialogActions>
              <Button autoFocus onClick={handleClose} color="primary">
                H???y
              </Button>
              <Button
                onClick={() => {
                  handleClose();
                  props.initTransactionRequest({
                    history: props.history,
                    data: {
                      buyer: buyers.map((item) => item.publicAddress),
                      idPropertyInBlockchain: saleItem.idInBlockchain,
                      depositPrice: depositPrice,
                      transferPrice: transferPrice,
                      depositTime: depositTime,
                    },
                  });
                }}
                color="primary"
              >
                X??c nh???n
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state, ownProps) => {
  const transactionHash = ownProps.match.params.transactionHash;
  return {
    saleItem: state.listingSale.find(
      (item) => item.transactionHash == transactionHash
    ),
    user: JSON.parse(localStorage.getItem("user")),
    idTransaction: state.initTransaction.data && state.initTransaction.data._id,
    loading: state.initTransaction.loading,
    transactionContract: state.shared.transaction,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    initTransactionRequest: (data) => {
      dispatch(initTransactionRequest(data));
    },
    // initTransactionSuccess: (data) => {
    //   dispatch(initTransactionSuccess(data));
    // },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Init);
