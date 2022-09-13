// base - Product.find({ eamil : "abhi@nav.com" })

// bigQ(bigQuery) - search=coder&page=2&category=shortsleeves&rating[gte]=4&price[lte]=999&price[gte]=199
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
}
