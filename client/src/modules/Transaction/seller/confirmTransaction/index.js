import React from "react";
import { connect } from "react-redux";
import { confirmTransactionRequest } from "./actions";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";

import { convertWeiToVND } from "../../../../utils/convertCurrency";
import formatCurrency from "../../../../utils/formatCurrency";

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
const ConfirmTransaction = (props) => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="card">
      <div className="card-body">
        <div className="agent-details">
          <h5>X??c nh???n giao d???ch</h5>
          <ul className="address-list">
            <li>
              <span>Gi?? tr??? giao d???ch:</span>
              {formatCurrency(
                convertWeiToVND(props.transaction.transferPrice)
              )}{" "}
              VN??
            </li>
            <li>
              <span>S??? ti???n ???? ?????t c???c:</span>
              {formatCurrency(
                convertWeiToVND(props.transaction.depositPrice)
              )}{" "}
              VN??
            </li>
            <li>
              <span>S??? ti???n c??n l???i:</span>
              {formatCurrency(
                convertWeiToVND(
                  props.transaction.transferPrice -
                    props.transaction.depositPrice
                )
              )}{" "}
              VN??
            </li>
            <li>
              <span>Thu??? thu nh???p c?? nh??n:</span>
              {formatCurrency(
                convertWeiToVND(props.transaction.transferPrice * 0.02)
              )}{" "}
              VN??
            </li>
            <li>
              <span>S??? ti???n nh???n ???????c:</span>
              {formatCurrency(
                convertWeiToVND(
                  props.transaction.transferPrice -
                    props.transaction.depositPrice -
                    props.transaction.transferPrice * 0.02
                )
              )}{" "}
              VN??
            </li>
          </ul>
          <h6>L??u ??</h6>
          <ul className="address-list">
            <li>
              Vi???c ?????ng ?? x??c nh???n giao d???ch n??y ?????ng ngh??a b???n ph???i th???c hi???n
              ????ng c??c y??u c???u c???a ??i???u kho???n c???a h???p ?????ng!
            </li>
          </ul>
        </div>
        {props.transaction.state == "PAYMENT_REQUEST" && !props.checkExpired && (
          <button
            className="btn v3 float-right mt-5 "
            onClick={handleClickOpen}
          >
            <i className="ion-android-cancel"></i> X??c nh???n giao d???ch
          </button>
        )}
      </div>

      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          X??c nh???n giao d???ch
        </DialogTitle>
        <DialogContent dividers>
          <div className="agent-details">
            <h5>Ngh??a v??? b??n b??n</h5>
            <ol className="address-list">
              <li>
                a) Chuy???n giao ?????t, t??i s???n g???n li???n v???i ?????t cho b??n B ????? di???n
                t??ch, ????ng h???ng ?????t, lo???i ?????t, v??? tr??, s??? hi???u, t??nh tr???ng ?????t
                v?? t??i s???n g???n li???n v???i ?????t nh?? ???? tho??? thu???n;
              </li>
              <li>
                b) Giao gi???y t??? c?? li??n quan ?????n quy???n s??? d???ng ?????t, quy???n s??? h???u
                t??i s???n g???n li???n v???i ?????t cho b??n B.
              </li>
            </ol>
          </div>
          <div className="agent-details">
            <h5>Cam ??oan c???a b??n b??n</h5>
            <ol className="address-list">
              <li>
                a) Nh???ng th??ng tin v??? nh??n th??n, v??? th???a ?????t v?? t??i s???n g???n li???n
                v???i ?????t ???? ghi trong H???p ?????ng n??y l?? ????ng s??? th???t;
              </li>
              <li>
                b) Th???a ?????t thu???c tr?????ng h???p ???????c chuy???n nh?????ng quy???n s??? d???ng
                ?????t theo quy ?????nh c???a ph??p lu???t;
              </li>
              <li>
                c) T???i th???i ??i???m giao k???t H???p ?????ng n??y: Th???a ?????t v?? t??i s???n g???n
                li???n v???i ?????t kh??ng c?? tranh ch???p, Quy???n s??? d???ng ?????t v?? c??c t??i
                s???n g???n li???n v???i ?????t kh??ng b??? k?? bi??n ????? b???o ?????m thi h??nh ??n;
              </li>
              <li>
                d) Vi???c giao k???t H???p ?????ng n??y ho??n to??n t??? nguy???n, kh??ng b??? l???a
                d???i, kh??ng bi?? ??p bu???c;
              </li>
              <li>
                e) Th???c hi???n ????ng v?? ?????y ????? c??c tho??? thu???n ???? ghi trong H???p ?????ng
                n??y.
              </li>
            </ol>
          </div>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose} color="primary">
            H???y
          </Button>
          <Button
            onClick={() => {
              handleClose();
              props.confirmTransactionRequest(props.transaction);
            }}
            color="primary"
          >
            X??c nh???n
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

// };

const mapStateToProps = (state) => {
  return {
    transaction: state.transaction.data,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    confirmTransactionRequest: (idTransaction) => {
      dispatch(confirmTransactionRequest(idTransaction));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmTransaction);
