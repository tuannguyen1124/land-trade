import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import formatDate from "../../utils/formatDate";
import { convertWeiToVND } from "../../utils/convertCurrency";
import axios from "axios";
import formatCurrency from "../../utils/formatCurrency";

function TransactionDetail(props) {
  const [buyers, setBuyers] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [transaction, setTransaction] = useState({});
  const [property, setProperty] = useState({});

  // get all user infor from publicAddress
  const getUserProfile = async (publicAddress) => {
    const response = await axios({
      method: "GET",
      url: `${process.env.REACT_APP_BASE_URL_API}/users/${publicAddress}`,
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

  // get participants information
  useEffect(() => {
    (async () => {
      const responseT = await axios({
        method: "get",
        url: `${process.env.REACT_APP_BASE_URL_API}/transaction/${props.match.params.txHash}`,
      });
      let transaction = responseT.data.data;
      const responseP = await axios({
        method: "get",
        url: `${process.env.REACT_APP_BASE_URL_API}/certification/id-in-blockchain/${transaction.idPropertyInBlockchain}`,
      });
      let property = responseP.data.data;
      const [buyersInfo, sellersInfo] = await getParticipantsInfo(
        transaction.buyers,
        transaction.sellers
      );
      setTransaction(transaction);
      setProperty(property);
      setBuyers(buyersInfo);
      setSellers(sellersInfo);
    })();
  }, []);

  let renderTimeline = (transaction) => {
    let cycleTransaction = [
      "DEPOSIT_REQUEST",
      "DEPOSIT_CANCELED_BY_BUYER",
      "DEPOSIT_CANCELED_BY_SELLER",
      "DEPOSIT_CONFIRMED",
      "DEPOSIT_BROKEN_BY_SELLER",
      "DEPOSIT_BROKEN_BY_BUYER",
      "PAYMENT_REQUEST",
      "DEPOSIT_BROKEN_BY_BUYER",
      "TRANSFER_CANCELED_BY_SELLER",
      "PAYMENT_CONFIRMED",
    ];

    const data = {
      DEPOSIT_REQUEST: {
        // title: `${buyers[0] && buyers[0].fullName} ?????t c???c`,
        title: `Y??u c???u ?????t c???c`,
        time: formatDate(transaction.createdAt),
        description: `${
          buyers[0] && buyers[0].fullName
        } g???i y??u c???u ?????t c???c t???i ${
          sellers[0] && sellers[0].fullName
        } gi?? tr??? ${formatCurrency(
          convertWeiToVND(transaction.depositPrice)
        )} VN??`,
        explorer: transaction.transactionHash,
      },

      DEPOSIT_CANCELED_BY_BUYER: {
        // title: `${buyers[0] && buyers[0].fullName} h???y ?????t c???c`,
        title: `Giao d???ch th???t b???i`,
        time:
          transaction.transactionCanceled &&
          formatDate(transaction.transactionCanceled.time),
        description: `${
          buyers[0] && buyers[0].fullName
        } h???y y??u c???u ?????t c???c v?? nh???n l???i ti???n ?????t c???c ${formatCurrency(
          convertWeiToVND(transaction.depositPrice)
        )} VN??`,
        explorer:
          transaction.transactionCanceled &&
          transaction.transactionCanceled.txHash,
      },

      DEPOSIT_CANCELED_BY_SELLER: {
        // title: `${sellers[0] && sellers[0].fullName} t??? ch???i giao d???ch`,
        title: `Giao d???ch th???t b???i`,
        time:
          transaction.transactionCanceled &&
          formatDate(transaction.transactionCanceled.time),
        description: `${
          sellers[0] && sellers[0].fullName
        } t??? ch???i giao d???ch v?? ${
          buyers[0] && buyers[0].fullName
        } nh???n l???i ${formatCurrency(
          convertWeiToVND(transaction.depositPrice)
        )} VN?? ti???n ?????t c???c `,
        explorer:
          transaction.transactionCanceled &&
          transaction.transactionCanceled.txHash,
      },

      DEPOSIT_CONFIRMED: {
        // title: `${
        //   sellers[0] && sellers[0].fullName
        // } ch???p nh???n giao d???ch v?? nh???n ?????t c???c`,
        title: `Ch???p nh???n giao d???ch`,
        time:
          transaction.depositConfirmed &&
          formatDate(transaction.depositConfirmed.time),
        description: `${
          sellers[0] && sellers[0].fullName
        } ch???p nh???n giao d???ch v???i ${
          buyers[0] && buyers[0].fullName
        } v?? nh???n ${formatCurrency(
          convertWeiToVND(transaction.depositPrice)
        )} VN?? ti???n ?????t c???c`,
        explorer:
          transaction.depositConfirmed && transaction.depositConfirmed.txHash,
      },

      DEPOSIT_BROKEN_BY_SELLER: {
        // title: `${sellers[0] && sellers[0].fullName} h???y giao d???ch`,
        title: `Giao d???ch th???t b???i`,
        time:
          transaction.transactionCanceled &&
          formatDate(transaction.transactionCanceled.time),
        description: `${
          sellers[0] && sellers[0].fullName
        } h???y giao d???ch v?? ?????n b?? h???p ?????ng cho ${
          buyers[0] && buyers[0].fullName
        } gi?? tr??? ${formatCurrency(
          convertWeiToVND(transaction.depositPrice * 2)
        )} VN??`,
        explorer:
          transaction.transactionCanceled &&
          transaction.transactionCanceled.txHash,
      },

      DEPOSIT_BROKEN_BY_BUYER: {
        // title: `${buyers[0] && buyers[0].fullName} h???y giao d???ch`,
        title: `Giao d???ch th???t b???i`,
        time:
          transaction.transactionCanceled &&
          formatDate(transaction.transactionCanceled.time),
        description: `${
          buyers[0] && buyers[0].fullName
        } h???y giao d???ch v?? m???t ti???n ?????t c???c`,
        explorer:
          transaction.transactionCanceled &&
          transaction.transactionCanceled.txHash,
      },

      PAYMENT_REQUEST: {
        // title: `${buyers[0] && buyers[0].fullName} thanh to??n s??? ti???n c??n l???i`,
        title: `Thanh to??n`,
        time: transaction.payment && formatDate(transaction.payment.time),
        description: `${
          buyers[0] && buyers[0].fullName
        } thanh to??n s??? ti???n c??n l???i: ${formatCurrency(
          convertWeiToVND(transaction.transferPrice - transaction.depositPrice)
        )}VN?? cho ${
          sellers[0] && sellers[0].fullName
        } v?? + thu??? ${formatCurrency(
          convertWeiToVND(transaction.transferPrice * 0.005)
        )}VN?? cho nh?? n?????c`,
        explorer: transaction.payment && transaction.payment.txHash,
      },

      TRANSFER_CANCELED_BY_BUYER: {
        // title: `${buyers[0] && buyers[0].fullName} h???y giao d???ch`,
        title: `Giao d???ch th???t b???i`,
        time:
          transaction.transactionCanceled &&
          formatDate(transaction.transactionCanceled.time),
        description: `${
          buyers[0] && buyers[0].fullName
        } h???y giao d???ch nh???n l???i s??? ti???n thanh to??n c??n l???i ${formatCurrency(
          convertWeiToVND(transaction.transferPrice - transaction.depositPrice)
        )} VN?? + thu??? ${formatCurrency(
          convertWeiToVND(transaction.transferPrice * 0.005)
        )} VN?? v?? m???t ti???n ?????t c???c`,
        explorer:
          transaction.transactionCanceled &&
          transaction.transactionCanceled.txHash,

        explorer: transaction.payment && transaction.payment.txHash,
      },
      TRANSFER_CANCELED_BY_SELLER: {
        // title: `${sellers[0] && sellers[0].fullName} h???y giao d???ch`,
        title: `Giao d???ch th???t b???i`,
        time:
          transaction.transactionCanceled &&
          formatDate(transaction.transactionCanceled.time),
        description: `${
          sellers[0] && sellers[0].fullName
        } h???y giao d???ch v?? ?????n b?? h???p ?????ng ${formatCurrency(
          convertWeiToVND(transaction.depositPrice * 2)
        )}VN?? cho ${buyers[0] && buyers[0].fullName}.  ${
          buyers[0] && buyers[0].fullName
        } nh??n l???i s??? ti???n ???? thanh to??n v?? ti???n ?????n b?? h???p ?????ng.`,
        explorer:
          transaction.transactionCanceled &&
          transaction.transactionCanceled.txHash,
      },
      PAYMENT_CONFIRMED: {
        // title: `${sellers[0] && sellers[0].fullName} ch???p nh???n thanh to??n`,
        title: `X??c nh???n giao d???ch`,
        time:
          transaction.paymentConfirmed &&
          formatDate(transaction.paymentConfirmed.time),
        description: `${
          sellers[0] && sellers[0].fullName
        } nh???n s??? ti???n c??n l???i: ${formatCurrency(
          convertWeiToVND(transaction.transferPrice - transaction.depositPrice)
        )}VN?? - thu??? ${formatCurrency(
          convertWeiToVND(transaction.transferPrice * 0.002)
        )}VN??. ${buyers[0] && buyers[0].fullName} nh???n quy???n s??? h???u t??i s???n`,
        explorer:
          transaction.paymentConfirmed && transaction.paymentConfirmed.txHash,
      },
    };

    return cycleTransaction.map((item, index) => {
      let pos = 0;
      if (transaction.state == "CANCELED") {
        pos = cycleTransaction.findIndex(
          (item) => item == transaction.transactionCanceled.reason
        );
      } else {
        pos = cycleTransaction.findIndex((item) => item == transaction.state);
      }
      if (
        index < pos &&
        (item.includes("BROKEN") || item.includes("CANCELED"))
      ) {
        return "";
      }
      if (index > pos) {
        return "";
      }
        return (
      
          <div class="row" key={index}>
            <div class="col-auto text-center flex-column d-none d-sm-flex">
              <div class="row h-50">
                <div class="col border-right">&nbsp;</div>
                <div class="col">&nbsp;</div>
              </div>
              <h5 class="m-2">
                <span class="badge badge-pill bg-success border">&nbsp;</span>
              </h5>
              <div class="row h-50">
                <div class="col border-right">&nbsp;</div>
                <div class="col">&nbsp;</div>
              </div>
            </div>
            <div class="col py-2">
              <div class="card border-success shadow">
                <div class="card-body">
                  <div class="float-right text-success">{data[item].time}</div>
                  <h4 class="card-title text-success">{data[item].title}</h4>
                  <p class="card-text">{data[item].description}</p>
                  <a
                    target="_blank"
                    href={`${process.env.REACT_APP_EXPLORER}/tx/${data[item].explorer}`}
                  >
                    Ki???m tra giao d???ch tr??n Blockchain
                  </a>
                </div>
              </div>
            </div>
          </div>
        )

      
    });
  };

  return (
    <div className="container mt-100">
      <div className="card">
        <div className="card-body">
          <div className="row">
            <div className="agent-details col-6">
              <h5>T??i s???n giao d???ch</h5>
              <ul className="address-list">
                <li>
                  <span>?????a ??i???m:</span>
                  {property &&
                    property.properties &&
                    property.properties.landLot.address}
                </li>
                <li>
                  <span>Gi?? tr??? ?????t c???c:</span>
                  {formatCurrency(
                    convertWeiToVND(transaction.depositPrice)
                  )}{" "}
                  VN??
                </li>
                <li>
                  <span>Gi?? tr??? giao d???ch:</span>
                  {formatCurrency(
                    convertWeiToVND(transaction.transferPrice)
                  )}{" "}
                  VN??
                </li>
              </ul>
            </div>
            <div className="agent-details col-6">
              <h5>Th???i gian giao d???ch</h5>
              <ul className="address-list">
                <li>
                  <span>Ng??y b???t ?????u:</span>
                  {formatDate(transaction.timeStart)}
                </li>
                <li>
                  <span>Ng??y k???t th??c:</span>
                  {formatDate(transaction.timeEnd)}
                </li>
              </ul>
            </div>

            <hr />
            <div className="agent-details col-6">
              <h5>B??n chuy???n nh?????ng</h5>
              {sellers.map((item, index) => (
                <ul className="address-list" key={index}>
                  <li>
                    <span>H??? t??n:</span>
                    {item.fullName}
                  </li>
                  <li>
                    <span>S??? CMND:</span>
                    {item.idNumber}
                  </li>
                  <li>
                    <span>Email:</span>
                    {item.email}
                  </li>
                </ul>
              ))}
            </div>
            <div className="agent-details col-6">
              <h5>B??n nh???n chuy???n nh?????ng</h5>
              {buyers.map((item, index) => (
                <ul className="address-list" key={index}>
                  <li>
                    <span>H??? t??n:</span>
                    {item.fullName}
                  </li>
                  <li>
                    <span>S??? CMND:</span>
                    {item.idNumber}
                  </li>
                  <li>
                    <span>Email:</span>
                    {item.email}
                  </li>
                </ul>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div class="container py-2">
        <h3 class="font-weight-light text-center text-muted py-3">
          L???ch s??? giao d???ch
        </h3>
        {renderTimeline(transaction)}
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    transaction: state.transaction.data,
    property: state.transaction.property,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(TransactionDetail);
