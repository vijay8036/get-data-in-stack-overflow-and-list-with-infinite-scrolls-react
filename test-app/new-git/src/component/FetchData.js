import React, { Component } from "react";
import axios from "axios";
/* import $ from "jquery"; */
import "bootstrap/dist/js/bootstrap.bundle";
import Moment from "moment";
import AnsModal from "./ansModal";
import InfiniteScroll from "react-infinite-scroller";
class FetchData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      isLoading: true,
      error: null,
      question_id: null,
      question: [],
      pageNumber: 1,
      pageItems: 15
    };
  }
  fetchData = () => {
    axios
      .get(
        `https://api.stackexchange.com/2.2/questions?page=${this.state.pageNumber}&pagesize=${this.state.pageItems}&order=desc&sort=activity&site=stackoverflow&filter=!b1MMEU)j2D*uc1`
      )
      .then(response => {
        this.setState({
          items: [...this.state.items, ...response.data.items],
          pageNumber: this.state.pageNumber + 1,
          isLoading: false
        });
      })
      .catch(error => {
        console.log(error);
        this.setState({ error: error, isLoading: false });
      });
  };
  getQuestion = qId => {
    this.setState({ question_id: qId });
    var ques = this.state.items.filter(i => {
      return i.question_id === qId;
    });
    this.setState({ question: ques[0] });
  };

  componentDidMount() {
    this.fetchData();
  }

  render() {
    const { items, isLoading, error } = this.state;
    return (
      <React.Fragment>
        {error && "The error is: " + error}
        {isLoading ? (
          <h4
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)"
            }}
          >
            Loading...
          </h4>
        ) : (
          <div className="container py-5">
            <InfiniteScroll
              pageStart={this.state.items.length}
              loadMore={this.fetchData}
              hasMore={true || false}
              loader={
                <div className="loader" key={0}>
                  Loading ...
                </div>
              }
            >
              {items.map((data, i) => {
                return (
                  <div
                    key={i}
                    className="card mb-3"
                    data-toggle="modal"
                    data-target="#ansModal"
                    onClick={() => this.getQuestion(data.question_id)}
                  >
                    <div className="card-body">
                      <div className="form-row">
                        <div className="col-auto">
                          <img
                            alt={data.owner.display_name}
                            style={{ maxWidth: "58px" }}
                            src={data.owner.profile_image}
                            className="img-fluid"
                          />
                        </div>
                        <div className="col">
                          <h5
                            className="mb-1"
                            dangerouslySetInnerHTML={{ __html: data.title }}
                          ></h5>
                          <small>{data.owner.display_name}</small>
                          <small className="float-right mt-1">
                            {Moment(data.creation_date).format(
                              "DD MMM YYYY, h:mm a"
                            )}
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </InfiniteScroll>
          </div>
        )}
        <AnsModal question={this.state.question} />
      </React.Fragment>
    );
  }
}

export default FetchData;
