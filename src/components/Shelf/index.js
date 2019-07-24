import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { fetchProducts } from '../../services/shelf/actions';

import Spinner from '../Spinner';
import ShelfHeader from './ShelfHeader';
import ProductList from './ProductList';

import './style.scss';

class Shelf extends Component {
  static propTypes = {
    fetchProducts: PropTypes.func.isRequired,
    products: PropTypes.array.isRequired,
    filters: PropTypes.array,
    sort: PropTypes.string
  };

  state = {
    test: 'Initial State',
    isLoading: false
  };

  constructor () {
    super();
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleUpdateStateClick = this.handleUpdateStateClick.bind(this);
    this.handleIFrameOnLoad = this.handleIFrameOnLoad.bind(this);

    this.iframeRef = React.createRef();
  }

  componentDidMount() {
    this.handleFetchProducts();
  }

  componentWillReceiveProps(nextProps) {
    const { filters: nextFilters, sort: nextSort } = nextProps;

    if (nextFilters !== this.props.filters) {
      this.handleFetchProducts(nextFilters, undefined);
    }

    if (nextSort !== this.props.sort) {
      this.handleFetchProducts(undefined, nextSort);
    }
  }

  handleFetchProducts = (
    filters = this.props.filters,
    sort = this.props.sort
  ) => {
    this.setState({ isLoading: true });
    this.props.fetchProducts(filters, sort, () => {
      this.setState({ isLoading: false });
    });
  };

  handleFormSubmit = (e) => {

    e.preventDefault();
    
    this.setState({test: 'refreshing'})
    fetch('http://localhost:8001/api/test', {
      method: 'POST'
    }).then((response) => {
      response.json().then((body) => {
        console.log(body);
      });
    });
  };

  handleUpdateStateClick = (e) => {
    e.preventDefault();
    this.setState({test: 'State Is Updated'})
  };

  handleIFrameOnLoad = () => {
    alert("Response returned.")

    //Not able to get the response data, tried to get the data from iFrame, but it will cause a CORS issue..
    //console.log(this.iframeRef.current.contentWindow.document);
  }

  render() {
    const { products } = this.props;
    const { isLoading } = this.state;

    return (
      <React.Fragment>
        {this.state.test}

        

        <form action="http://localhost:8001/api/test" method="POST" target="dummyframe">
          <input type="text" name="username"/>
          <input type="button" value="Update State" onClick={this.handleUpdateStateClick}/>
          <input type="submit" value="submit"/>
        </form>

        <iframe onLoad={this.handleIFrameOnLoad} 
          title="dummyframe" 
          width="0" 
          height="0" 
          border="0" 
          name="dummyframe" 
          id="dummyframe"
          ref={this.iframeRef}>
        </iframe>


        {isLoading && <Spinner />}
        <div className="shelf-container">
          <ShelfHeader productsLength={products.length} />
          <ProductList products={products} />
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  products: state.shelf.products,
  filters: state.filters.items,
  sort: state.sort.type
});

export default connect(
  mapStateToProps,
  { fetchProducts }
)(Shelf);
