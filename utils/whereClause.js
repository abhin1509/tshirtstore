// base - Product.find({ eamil : "abhi@nav.com" })

// bigQ(bigQuery) - search=coder&page=2&category=shortsleeves&rating[gte]=4
// &price[lte]=999&price[gte]=199&limit=5
//        search, pagination, category

class WhereClause {
  constructor(base, bigQ) {
    this.base = base;
    this.bigQ = bigQ;
  }

  search() {
    const searchword = this.bigQ.search
      ? {
          name: {
            $regex: this.bigQ.search,
            $options: "i",
          },
        }
      : {};

    this.base = this.base.find({ ...searchword });
    return this;
  }

  // aggregation or filter:(no pagination without product)
  filter() {
    const copyQ = { ...this.bigQ };
    delete copyQ["search"];
    delete copyQ["limit"];
    delete copyQ["page"];

    // convert bigQ into a string => copyQ
    let stringOfCopyQ = JSON.stringify(copyQ);

    stringOfCopyQ = stringOfCopyQ.replace(
      /\b(gte|lte|gt|lt)\b/g,
      (m) => `$${m}`
    );

    const jsonOfCopyQ = JSON.parse(stringOfCopyQ);

    this.base = this.base.find(jsonOfCopyQ);
    return this;
  }

  // pagination
  pager(resultperPage) {
    let currentPage = 1;
    if (this.bigQ.page) {
      currentPage = this.bigQ.page;
    }

    const skipValue = resultperPage * (currentPage - 1);

    this.base = this.base.limit(resultperPage).skip(skipValue);
    return this;
  }
}

module.exports = WhereClause;
