import React, { useEffect, Fragment } from "react";
import { connect } from "react-redux";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";

import { convertWeiToVND } from "../../utils/convertCurrency";
import formatCurrency from "../../utils/formatCurrency";

import { cancelTransactionRequest, cancelTransactionSuccess } from "./action";

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

const CancelTransaction = (props) => {
  const [open, setOpen] = React.useState(false);
  const [compensation, setCompensation] = React.useState(0);
  const [received, setReceived] = React.useState(0);
  const [tax, setTax] = React.useState(0);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const TRANSACTION_STATE = {
    DEPOSIT_REQUEST: "DEPOSIT_REQUEST",
    DEPOSIT_CONFIRMED: "DEPOSIT_CONFIRMED",
    PAYMENT_REQUEST: "PAYMENT_REQUEST",
    PAYMENT_CONFIRMED: "PAYMENT_CONFIRMED",
    CANCELED: "CANCELED",
  };

  const PARTY = {
    BUYER: "BUYER",
    SELLER: "SELLER",
  };

  useEffect(() => {
    if (props.party === PARTY.BUYER) {
      if (props.transaction.state === TRANSACTION_STATE.DEPOSIT_REQUEST) {
        setCompensation(0);
        setReceived(props.transaction.depositPrice);
        setTax(0);
      }
      if (props.transaction.state === TRANSACTION_STATE.DEPOSIT_CONFIRMED) {
        setCompensation(0);
        setReceived(0);
        setTax(0);
      }
      if (props.transaction.state === TRANSACTION_STATE.PAYMENT_REQUEST) {
        setCompensation(0);
        setReceived(
          props.transaction.transferPrice - props.transaction.depositPrice
        );
        setTax(props.transaction.transferPrice * 0.005);
      }
    }
    if (props.party === PARTY.SELLER) {
      // if (props.transaction.state == "DEPOSIT_REQUEST") {
      //   setCompensation(0);
      //   setReceived(0);
      //   setTax(0);
      // }
      if (props.transaction.state === TRANSACTION_STATE.DEPOSIT_CONFIRMED) {
        setCompensation(2 * props.transaction.depositPrice);
        setReceived(0);
        setTax(0);
      }
      if (props.transaction.state === TRANSACTION_STATE.PAYMENT_REQUEST) {
        setCompensation(2 * props.transaction.depositPrice);
        setReceived(0);
        setTax(0);
      }
    }
  }, [props.transaction]);

  return (
    <Fragment>
      {props.checkExpired && (
        <div>
          <div className="text-center">
            <h5>Giao d???ch ???? h???t h???n</h5>
          </div>
          <button
            className="btn v3 float-right mt-5 "
            onClick={() =>
              props.history.push(
                `/transaction-detail/${props.transaction.transactionHash}`
              )
            }
          >
            <i className="ion-ios-search"></i> Tra c???u giao d???ch t???i ????y
          </button>
        </div>
      )}

      {!props.checkExpired &&
        !["CANCELED", "PAYMENT_CONFIRMED"].includes(
          props.transaction.state
        ) && (
          <button
            className="btn v3 float-right mt-5 "
            onClick={handleClickOpen}
          >
            <i className="ion-android-cancel"></i> H???y giao d???ch
          </button>
        )}

      {props.transaction.state === "CANCELED" && (
        <div>
          <div className="text-center">
            <h5>Giao d???ch ???? h???y</h5>
          </div>
          <button
            className="btn v3 float-right mt-5 "
            onClick={() =>
              props.history.push(
                `/transaction-detail/${props.transaction.transactionHash}`
              )
            }
          >
            <i className="ion-ios-search"></i> Tra c???u giao d???ch t???i ????y
          </button>
        </div>
      )}

      {props.transaction.state === "PAYMENT_CONFIRMED" && (
        <div>
          <div className="text-center">
            <h5>Giao d???ch ???? th??nh c??ng </h5>
          </div>
          <button
            className="btn v3 float-right mt-5 "
            onClick={() =>
              props.history.push(
                `/transaction-detail/${props.transaction.transactionHash}`
              )
            }
          >
            <i className="ion-ios-search"></i> Tra c???u giao d???ch t???i ????y
          </button>
        </div>
      )}

      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          H???y giao d???ch
        </DialogTitle>
        <DialogContent dividers>
          <div className="agent-details">
            <h5>Gi?? tr??? ?????t c???c</h5>
            <ul className="address-list">
              <li>
                <span>Ng?????i h???y h???p ?????ng:</span>
                {props.user.fullName} - {props.party}
              </li>
              <li>
                <span>S??? ti???n ?????n b??:</span>
                {formatCurrency(convertWeiToVND(compensation))} VN??
              </li>
              <li>
                <span>S??? ti???n nh???n l???i:</span>
                {formatCurrency(convertWeiToVND(received))} VN??
              </li>
              <li>
                <span>Ti???n thu???:</span>
                {formatCurrency(convertWeiToVND(tax))} VN??
              </li>
            </ul>
          </div>
          {/* <div className="agent-details">
            <h5>L??u ??:</h5>
            <ul className="address-list">
              <li>
                V???i vi???c x??c nh???n n??y b???n s??? nh???n ???????c ti???n ?????t c???c, v?? t??i s???n
                s??? ???????c chuy???n nh?????ng n???u ng?????i mua thanh to??n ????? s??? ti???n giao
                d???ch.
              </li>
            </ul>
          </div> */}
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose} color="primary">
            H???y
          </Button>
          <Button
            onClick={() => {
              handleClose();
              props.cancelTransaction(
                props.transaction,
                props.user.publicAddress
              );
            }}
            color="primary"
          >
            X??c nh???n
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    transaction: state.transaction.data,
    user: state.user.data,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    cancelTransaction: (transaction, publicAddress) => {
      dispatch(cancelTransactionRequest(transaction, publicAddress));
    },
    cancelTransactionSuccess: (txHash) => {
      dispatch(cancelTransactionSuccess(txHash));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CancelTransaction);
