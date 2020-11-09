# react-server-side-table

자주 사용하던 [jquery.dataTables](https://datatables.net/)를 react에서도 비슷하게 사용하기 위해 만들어졌습니다.<br/>
많은 설정 없이 서버 측에 데이터를 요청해서 보여주기에 적합니다.<br/>
데이터의 정렬, 페이지 처리, 표시 개수, 기본/추가 검색 필터, th의 병합, td의 사용자 지정 변경 등의 기능만 필요할 경우 적합하며, <br/>
고정 헤더 나 테이블 스크롤, td병합, 클라이언트 사이드 등은 아직은 지원하지 않습니다.

## 설치

```bash
# npm
npm install react-server-side-table --save

# yarn
yarn add react-server-side-table
```

## 기본 사용법 (DEMO - BASIC)

```js
import ReactServerSideTable from 'react-server-side-table';

const url = 'your url';
const headers = [
  [
    {title: "아이디"},
    {title: "이름"},
    {title: "연락처"},
    {title: "이메일"},
    {title: "등록일"}
  ]
];
const columns = [
  {name: 'id'}, 
  {name: 'name'}, 
  {name: 'phone'}, 
  {name: 'email'}, 
  {name: 'reg_date'}
];
...
<ReactServerSideTable 
  url={url} 
  headers={headers} 
  columns={columns} 
/>
...
```

## DEMO
[기본설정과 변경 가능한 설정등 확인할 수 있습니다.](https://phy64.github.io/react-server-side-table_demo/) 

## props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| url | String |  | 서버 측 요청 url (필수) |
| headers | Object[][]|  | 테이블 헤더의 설정값입니다. `rowspan`, `colspan`사용을 위해서 이중 배열입니다.(필수) |
| columns | Object[] |  | 테이블 각 행 열의 설정값입니다.(필수) |
| ordering | Boolean | true | 서버 측 요청에 정렬에 관련된 쿼리 스트링 포함 여부입니다. 해당 설정이 true 일 때 props `order`, `headers > sortable` 설정을 사용할 수 있습니다. |
| order | Object |  | 첫 렌더링 정렬의 기준이 될 열과 방향입니다. `column`, `direction` 속성이 있어야 합니다. |
| lengthChange | Boolean | true | 기본 제공되는 표시개수 변경 셀렉트의 사용 여부입니다. props `paging` false 일 때는 사용할 수 없습니다. |
| searching | Boolean | true | 기본 제공되는 검색 필터 사용 여부입니다. |
| pageInfo | Boolean | true | 하단에 위치한 페이지 정보의 사용 여부입니다. props `paging` 설정에 따라 보여지는 방식이 다릅니다. |
| paging | Boolean | true | 페이지 처리의 사용 유무입니다. props `lengthChange`에 영향을 줍니다. |
| currentPage | Number | 1 | 첫 렌더링 될 때 보일 페이지 번호입니다. 다른 화면에서 다시 돌아올 때 페이지 번호를 기억해야 할 때 유용할 수 있습니다. 없는 번호를 요청하면 데이터를 가져오지 못합니다. |
| perPage | Number | 10 | 첫 렌더링 될 때 보일 행의 개수입니다. |
| addQueryParameters | Object |  | 서버 측 요청에 추가로 포함될 쿼리 스트링입니다. 사용자 지정 검색 필터를 만들어서 활용할 수 있습니다. 마지막에 포함되므로 중복된 key는 덮여집니다. |
| checkboxCheckedCallback | Function |  | 기본 제공되는 checkbox의 이벤트 callback 함수입니다. [checked values]를 반환합니다. |
| radioCheckedCallback | Function |  | 기본 제공되는 radio의 이벤트 callback 함수입니다. checked value를 반환합니다. |
| reRenderApiRequest | Boolean | false  | 컴포넌트가 rerender 될 때 서버 측 재 요청 여부입니다. 첫 렌더링 이후 `ordering`, `order`, `lengthChange`, `searching`, `paging`, `currentPage`, `perPage`, `addQueryParameters`의 설정값을 변경하고 데이터를 올바르게 반영하기 위해선 true 여야 합니다. |
| settings | Object | 많음... | 외형이나 세부 설정의 집합입니다. 첫 렌더링 후 변경되지 않습니다. 기본 설정과 사용자 설정이 병합됩니다. |

### props - headers

| Name | Type | Description |
| --- | --- | --- |
| title | Node | 열의 제목입니다. String, Number, Element 등 렌더링 가능한 요소를 사용할 수 있습니다. |
| column | String | `checkboxAll`, `sortable`을 사용할 때 필수 값입니다. 연결할 데이터 키를 지정해야 합니다.
| checkboxAll | Boolean | 열에 적용된 checkbox를 컨트롤할 checkboxAll 사용 여부입니다. `title` 보다 우선순위에 있습니다.  사용할 열에만 지정해 주면 됩니다.<br/>`(주의)`각 열마다 사용할 수 있지만, 다 같은 동작을 합니다. |
| sortable | Boolean | 정렬 기능 사용 여부입니다. props `ordering`이 true 여야 합니다. 사용할 열에만 지정해 주면 됩니다. |
| rowSpan | Number | 병합할 행의 수입니다. |
| colSpan | Number | 병합할 열의 수입니다. |
| className | String | className을 입력하듯 문자열로 나열해 주면 됩니다. |

```js
//  headers example
const headings = [
  [
    {title: '', checkboxAll: true, column: 'id', rowSpan: 2},
    {title: '', rowSpan: 2},
    {title: 'No.', rowSpan: 2, className: 'class1 class2 class3 class4'},
    {title: '사용자 정보', colSpan: 5},
    {title: '등록일', column: 'reg_date', sortable: true, rowSpan: 2}
  ],
  [
    {title: <span><i className="fa fa-picture-o"/> 사진</span>},
    {title: <span><i className="fa fa-id-card"/> 아이디</span>, column: 'id', sortable: true},
    {title: <span><i className="fa fa-user"/> 이름</span>, column: 'name', sortable: true},
    {title: <span><i className="fa fa-phone"/> 연락처</span>, column: 'phone', sortable: true},
    {title: <span><i className="fa fa-envelope"/> 이메일</span>, column: 'email', sortable: true}
  ]
];
```

### props - columns

| Name | Type | Description |
| --- | --- | --- |
| name | String | 연결할 데이터 키를 지정합니다. |
| checkbox | Boolean | checkbox 사용 여부입니다. 실제 적용될 `data`, `formatter` 보다 우선순위에 있습니다. 사용할 열에만 지정해 주면 됩니다. data가 바뀔때 checked는 유지되지 않습니다.<br/>`name`으로 연결된 값이 `value`값이 됩니다.<br/>`(주의)`각 열마다 사용할 수 있지만, 다 같은 동작을 합니다. |
| formatter | Function | 열이 생성될 때 실행될 callback 함수입니다. `title` 보다 우선순위에 있습니다. { `rowData`, `dataIndex`, `total`, `from` } 인자로 전달합니다. String, Number, Element 등 렌더링 가능한 요소를 반환해야 합니다. |
| className | String | className을 입력하듯 문자열로 나열해 주면 됩니다. |

```js
//  columns example
const columns = [
  {
    name: 'id',
    checkbox: true
  }, 
  {
    name: 'name',
    radio: true
  },
  {
    name: 'seq',
    formatter: ({ dataIndex, total, from }) => {
      // 리스트 넘버링
      const rowNumber = total - (from - 1) - dataIndex;
      const addClass = rowNumber % 2 ? 'teal' : 'pink';

      return <span className={`ui label ${addClass}`}>{ rowNumber }</span>
    }
  },
  {
    name: 'avatar',
    formatter: ({ rowData }) => {
      return <img src={ rowData.avatar }/>
    }
  }, 
  {
    name: 'id'
  }, 
  {
    name: 'name',
    className: 'class1 class2 class3 class4'
  }, 
  {
    name: 'phone'
  }, 
  {
    name: 'email'
  }, 
  {
    name: 'reg_date'
  }
];
```

### props - settings

| Name | Type | Description |
| --- | --- | --- |
| defaultStyle | Boolean | 기본 스타일 사용 여부입니다. |
| wrapperClass | String | className을 입력하듯 문자열로 나열해 주면 됩니다. |
| tableClass | String | className을 입력하듯 문자열로 나열해 주면 됩니다. |
| loadingImage | Node | 렌더링 가능한 요소를 사용할 수 있습니다.(img tag 권장) 이미지가 위치하는 부모의 css class는 `.loading`입니다. 스타일을 추가하여 로딩 이미지를 변경해서 사용할 수 있습니다. |
| perPageValues | Number[] | `lengthChange`를 사용할때 지정될 값입니다. |
| pagingDisplayLength | Number | 표시할 페이지 버튼의 개수입니다. |
| pagingFirstLastBtn | Boolean | 처음, 마지막 버튼의 사용 여부입니다. |
| pagingPrevNextBtn | Boolean | 이전, 다음 버튼의 사용 여부입니다. |
| colGroup | String[] | 각 열의 너비를 지정합니다. |
| dataSrc | Object | 연결될 응답 데이터의 key 입니다. |
| language | Object | 내부 구성요소의 텍스트를 변경합니다. |
| queryParameterNames | Object | 서버 측 요청에 사용될 파라미터 명칭입니다. |
| orderDirectionNames | Object | 정렬 방향의 명칭입니다. |

```js
// default settings
...
settings: {
  defaultStyle: true,
  wrapperClass: '',
  tableClass: '',
  loadingImage: null,
  perPageValues: [10, 20, 30, 100],
  pagingDisplayLength: 10,
  pagingFirstLastBtn: true,
  pagingPrevNextBtn: true,
  colGroup: [],
  dataSrc: {
    data: "data",
    total: "total"
  },
  language: {
    lengthMenu: {
      show: 'Show',
      entries: 'entries'
    },
    pageInfo: {
      showing: 'Showing',
      to: 'to',
      of: 'of',
      entries: 'entries',
      formatter: null
    },
    pagination: {
      first: 'First',
      prev: 'Previous',
      next: 'Next',
      last: 'Last'
    },
    search: 'Search',
    empty : 'No entries to display'
  },
  queryParameterNames: {
    search: 'search',
    limit: 'limit',
    page: 'page',
    orderBy: 'orderBy',
    direction: 'direction',
  },
  orderDirectionNames: {
    ascending: 'asc',
    descending: 'desc',
  }
}
...

//  loadingImage & colGroup & language > pageInfo > formatter example
import LoadingImage from 'img src';
...
loadingImage: <img src={ LoadingImage }/>,
colGroup: ['20%', '20%', '20%', '20%', '20%'],
language: {
  pageInfo: {
    formatter: ({ total, from, to }) => {
      return `전체 ${total}개 항목 중 ${from} ~ ${to} 항목 보기`;
    } 
  }
}
...
```

### props - reRenderApiRequest

```javascript
// 클래스 컴포넌트 기준 reRenderApiRequest를 이용한 추가 검색 필터
...
this.state = {
  ...
  reRenderApiRequest: true,
  addQueryParameters: {
    name: ''
  }
  ...
};
...
// 검색
handleSearch = () => {
  const addQueryParameters = {
    name: `name input value`
  };
  
  this.setState({
    addQueryParameters
  });
};
...
const { reRenderApiRequest, addQueryParameters } = this.state;
<ReactServerSideTable 
  ...
  reRenderApiRequest={reRenderApiRequest}
  addQueryParameters={addQueryParameters}
  ...
/>
```

### Children
테이블 상단에 기본 `lengthMenu` 와 `search`가 위치한 `영역 사이`에 자식 요소를 배치합니다.<br/>
간략한 정보의 입력이나, 연관이 있는 버튼등의 배치에 유용합니다.

```javascript
<ReactServerSideTable 
  url={url} 
  headers={headers} 
  columns={columns} 
>
  <>
    <button className="btn btn-primary">children1</button>
    <button className="btn btn-secondary">children2</button>
    <button className="btn btn-success">children3</button>
    <button className="btn btn-danger">children4</button>
    <button className="btn btn-warning">children5</button>
  </>
</ReactServerSideTable>
```

## Api request
`GET` method

'example/api/users?`search`=&`limit`=&`page`=&`orderBy`=&`direction`=' + ...`addQueryParameters`

`queryParameterNames` 설정에 따라 달라집니다.

## 추가 계획
직장생활을 하다보니 언제가 될지는 모르겠지만...<br/>
고정 헤더, 테이블 스크롤, 더보기 조합<br/>
모바일과 반응형을 위한 아코디언 리스트(jquery.dataTables 같은)<br/>
Context Menu를 이용한 여러 기능들(추가, 삭제 등)...