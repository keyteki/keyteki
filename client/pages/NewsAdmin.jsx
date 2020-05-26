import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';

import AlertPanel from '../Components/Site/AlertPanel';
import TextArea from '../Components/Form/TextArea';
import * as actions from '../redux/actions';

class NewsAdmin extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            newsText: ''
        };

        this.onSaveClick = this.onSaveClick.bind(this);
    }

    componentDidMount() {
        this.props.loadNews({ limit: 5, forceLoad: true });
    }

    componentDidUpdate(props) {
        if (props.newsChanged) {
            setTimeout(() => {
                this.props.clearNewsStatus();
            }, 5000);
        }
    }

    onNewsTextChange(event) {
        this.setState({ newsText: event.target.value });
    }

    onEditTextChange(event) {
        this.setState({ editText: event.target.value });
    }

    onAddNews(event) {
        event.preventDefault();

        this.props.addNews(this.state.newsText);

        this.setState({ newsText: '' });
    }

    onDeleteClick(id) {
        this.props.deleteNews(id);
    }

    onEditClick(item) {
        this.setState({ editItemId: item.id, editText: item.text });
    }

    onSaveClick() {
        this.props.saveNews(this.state.editItemId, this.state.editText);
        this.setState({ editItemId: undefined, editText: undefined });
    }

    render() {
        let content = null;

        var renderedNews = this.props.news.map((newsItem) => {
            return (
                <tr key={newsItem.id}>
                    <td>{moment(newsItem.datePublished).format('YYYY-MM-DD')}</td>
                    <td>{newsItem.poster}</td>
                    <td>
                        {this.state.editItemId === newsItem.id ? (
                            <TextArea
                                name='newsEditText'
                                value={this.state.editText}
                                onChange={this.onEditTextChange.bind(this)}
                                rows='4'
                            />
                        ) : (
                            newsItem.text
                        )}
                    </td>
                    <td>
                        <div className='btn-group'>
                            {this.state.editItemId === newsItem.id ? (
                                <button
                                    type='button'
                                    className='btn btn-primary'
                                    onClick={this.onSaveClick}
                                >
                                    Save
                                </button>
                            ) : (
                                <button
                                    type='button'
                                    className='btn btn-primary'
                                    onClick={this.onEditClick.bind(this, newsItem)}
                                >
                                    Edit
                                </button>
                            )}
                            <button
                                type='button'
                                className='btn btn-danger'
                                onClick={this.onDeleteClick.bind(this, newsItem.id)}
                            >
                                Delete
                            </button>
                        </div>
                    </td>
                </tr>
            );
        });

        let successPanel = null;

        if (this.props.newsChanged) {
            successPanel = <AlertPanel message={this.props.successMessage} type={'success'} />;
        }

        if (this.props.apiLoading) {
            content = <div>Loading news from the server...</div>;
        } else if (this.props.apiSuccess === false) {
            content = <AlertPanel type='error' message={this.props.apiMessage} />;
        } else {
            content = (
                <div>
                    {successPanel}
                    <table className='table table-striped'>
                        <thead>
                            <tr>
                                <th className='col-sm-1'>Date</th>
                                <th className='col-sm-1'>Poster</th>
                                <th className='col-sm-8'>Text</th>
                                <th className='col-sm-2'>Action</th>
                            </tr>
                        </thead>
                        <tbody>{renderedNews}</tbody>
                    </table>

                    <form className='form'>
                        <TextArea
                            name='newsText'
                            label='Add news item'
                            value={this.state.newsText}
                            onChange={this.onNewsTextChange.bind(this)}
                        />

                        <button
                            type='submit'
                            className='btn btn-primary'
                            onClick={this.onAddNews.bind(this)}
                        >
                            Add
                        </button>
                    </form>
                </div>
            );
        }

        return content;
    }
}

NewsAdmin.displayName = 'NewsAdmin';
NewsAdmin.propTypes = {
    addNews: PropTypes.func,
    apiLoading: PropTypes.bool,
    apiMessage: PropTypes.string,
    apiSuccess: PropTypes.bool,
    clearNewsStatus: PropTypes.func,
    deleteNews: PropTypes.func,
    loadNews: PropTypes.func,
    news: PropTypes.array,
    newsChanged: PropTypes.bool,
    saveNews: PropTypes.func,
    successMessage: PropTypes.string
};

function getApiLoadingStatus(state) {
    if (state.api.REQUEST_NEWS && state.api.REQUEST_NEWS.loading) {
        return true;
    }

    if (state.api.DELETE_NEWS && state.api.DELETE_NEWS.loading) {
        return true;
    }

    if (state.api.SAVE_NEWS && state.api.SAVE_NEWS.loading) {
        return true;
    }

    return false;
}

function getApiMessage(state) {
    if (state.api.REQUEST_NEWS && state.api.REQUEST_NEWS.message) {
        return state.api.REQUEST_NEWS.message;
    }

    if (state.api.DELETE_NEWS && state.api.DELETE_NEWS.message) {
        return state.api.DELETE_NEWS.message;
    }

    if (state.api.SAVE_NEWS && state.api.SAVE_NEWS.message) {
        return state.api.SAVE_NEWS.message;
    }

    return undefined;
}

function getApiSuccess(state) {
    if (state.api.DELETE_NEWS && state.api.DELETE_NEWS.success) {
        return true;
    }

    if (state.api.SAVE_NEWS && state.api.SAVE_NEWS.success) {
        return true;
    }
}

function getSuccessMessage(state) {
    if (state.news.newsAdded) {
        return 'News item added successfully';
    }

    if (state.news.newsDeleted) {
        return 'News item deleted successfully';
    }

    if (state.news.newsSaved) {
        return 'News item saved successfully';
    }

    return undefined;
}

function mapStateToProps(state) {
    return {
        apiLoading: getApiLoadingStatus(state),
        apiMessage: getApiMessage(state),
        apiSuccess: getApiSuccess(state),
        loadNews: state.news.loadNews,
        loading: state.api.loading,
        news: state.news.news,
        newsChanged: state.news.newsSaved || state.news.newsDeleted || state.news.newsAdded,
        successMessage: getSuccessMessage(state)
    };
}

export default connect(mapStateToProps, actions)(NewsAdmin);
