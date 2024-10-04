// @ts-nocheck
import { FilterQuery, Query } from "mongoose";

export class QueryBuilder<T> {
  public query: Record<string, unknown>; // Payload for filters, pagination, etc.
  public modelQuery: Query<T[], T>; // Mongoose query object
  private defaultSort: Record<string, number>;
  private isSearchOrFilterApplied: boolean;

  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.query = query;
    this.modelQuery = modelQuery;
    this.defaultSort = { createdAt: -1 };
    this.isSearchOrFilterApplied = false;
  }

  private applySort() {
    if (this.isSearchOrFilterApplied) {
      this.modelQuery = this.modelQuery.sort({
        upVotes: -1,
        ...this.defaultSort,
      });
    } else {
      this.modelQuery = this.modelQuery.sort(this.defaultSort);
    }
    return this;
  }

  search(searchableFields: string[]) {
    const searchTerm = this.query?.searchTerm as string;

    if (searchTerm) {
      this.isSearchOrFilterApplied = true;
      this.modelQuery = this.modelQuery.find({
        $or: searchableFields.map(
          (field) =>
            ({
              [field]: new RegExp(searchTerm, "i"),
            }) as FilterQuery<T>
        ),
      });
    }

    return this;
  }

  filter() {
    const queryObj = { ...this.query };
    const excludeFields = ["searchTerm", "page", "limit", "sortBy", "fields"];

    excludeFields.forEach((e) => delete queryObj[e]);

    if (Object.keys(queryObj).length > 0) {
      this.isSearchOrFilterApplied = true;
      this.modelQuery = this.modelQuery.find(queryObj as FilterQuery<T>);
    }

    return this;
  }

  sort() {
    // This method now exists but doesn't do anything
    // The actual sorting is handled in applySort()
    return this;
  }

  paginate() {
    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 10;
    const skip = (page - 1) * limit;

    this.modelQuery = this.modelQuery.skip(skip).limit(limit);

    return this;
  }

  fields() {
    if (this.query.fields) {
      const fields = (this.query.fields as string).split(",").join(" ");
      this.modelQuery = this.modelQuery.select(fields);
    }

    return this;
  }

  build() {
    return this.applySort().modelQuery;
  }
}
