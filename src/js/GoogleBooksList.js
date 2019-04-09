import { getBooks } from './utils/api';
import { truncate } from './utils/helpers';
import { toastr } from './Toastr';

class GoogleBooksList {

  constructor(elem) {
    this.data = [];
    this.query = '';
    this.startIndex = 0;
    this.maxResults = 10;
    this.loadMore = true;
    this.isFetching = false;

    this.list = document.querySelector('.items__list');

    document.querySelector('.search__button').addEventListener('click', this.handleSearch.bind(this));
    document.querySelector('.search__input').addEventListener('keydown', this.handleSearch.bind(this));
    window.addEventListener('scroll', this.handleOnScroll.bind(this));
  }

  renderList() {
    this.list.innerHTML = '';

    if (this.data.length > 0) {
      this.data.forEach(item => {
        this.createDomElements(item);
        this.list.appendChild(this.li);
      });
    } else {
      this.createDomElements();
      this.list.appendChild(this.li);
    }
  }

  createDomElements(item) {
    this.li = document.createElement('li');
    this.li.classList.add('item');

    if (typeof item !== 'undefined') {
      this.li.innerHTML = `
        <img class="item__img" src=${item.volumeInfo.imageLinks ? item.volumeInfo.imageLinks.smallThumbnail : 'img/no-image.png'} alt='img' />
        <div class="item__title">${item.volumeInfo.title ? item.volumeInfo.title : 'No Title'}</div>
        <div class="item__desc">${item.volumeInfo.description ? truncate(item.volumeInfo.description, 160) : 'No Description'}</div>
      `;
    } else {
      this.li.innerHTML = `
        <div><h2>Sorry no results found</h2></div>
      `;
    }
  }

  fetchData() {
    if (this.loadMore === false) return;

    if (this.query === '') return;

    this.isFetching = true;
    toastr.openToastr('loading', 'Loading');

    getBooks(this.query, this.startIndex, this.maxResults)
      .then(({ data }) => {
        if (data.items) {
          this.data = [...this.data, ...data.items];
          console.log(this.data);
          this.startIndex += this.maxResults;
        } else {
          this.loadMore = false;
        }

        this.isFetching = false;
        this.renderList();
        toastr.closeToastr();
      })
      .catch(err => {
        console.log(err);
        toastr.openToastr('error', 'Ups, something\'s wrong');
      });
  }

  handleSearch(e) {
    if (e.type === 'keydown' && e.code != 'Enter') return;
    this.data = [];
    this.query = encodeURIComponent(document.querySelector('.search__input').value.trim());
    this.startIndex = 0;
    this.loadMore = true;
    this.isFetching = false;
    this.fetchData();
  }

  handleOnScroll() {
    let scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
    let scrollHeight = (document.documentElement && document.documentElement.scrollHeight) || document.body.scrollHeight;
    let clientHeight = document.documentElement.clientHeight || window.innerHeight;
    let scrolledToBottom = Math.ceil(scrollTop + clientHeight) >= scrollHeight;
    if (scrolledToBottom) {
      if (!this.isFetching) {
        this.fetchData();
      }
    }
  }
}

export default GoogleBooksList;