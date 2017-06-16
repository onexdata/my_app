import React, { Component } from 'react';
import ReactDom from 'react-dom';
import {
	ReactiveBase,
	CategorySearch,
	RatingsFilter,
	NestedList,
	ResultCard,
	DynamicRangeSlider,
	MultiList
} from '@appbaseio/reactivesearch';

import { config } from '../config.js';

require("./index.scss");

class HelloWorld extends Component {

	onData(res) {
		// const result = {
		// 	image: res.image_url,
		// 	title: res.title,
		// 	rating: res.rating,
		// 	desc: res.description,
		// 	pricing:res.pricing,
		// 	//brand : res.brand,
		// 	url: "#"
		// };
		// return result;

		const result = {
			image :  "http://image.promoworld.ca/migration-api-hidden-new/web/images/" + res.default_image,
			rating : res.rating,
			desc : (
				<div className="product-info">
					<div className="pull-right product-price">${res.price}</div>
					<span className="product-title">{res.product_name}</span>
				</div>
			),
			url: config.producturl + "/productdetail?sku=" + res.sku
		};
		return result;
	}

	render() {
		return (
			<ReactiveBase
			url= {config.baseURL}
			app="pdm"
			credentials="aakron:123456"
			>
				<div className="row reverse-labels">
					
					<nav className="row">
						<div className="col s3">
							<a href="#!" className="brand-logo">closeout promo</a>
						</div>
						<div className="col s9">
							<CategorySearch
								componentId="SearchSensor"
								appbaseField="title"
								categoryField="brand.raw"
								placeholder="Search"
								autocomplete={false}
							/>
						</div>
					</nav>

					<div className="col s3">
					<div className="">
						<div className="">
							<MultiList
								componentId="CategoryMultilistSensor"
								appbaseField="categories.raw"
								title="Category"
								size={100}
								sortBy="asc"
								showCount={true}
								showSearch={false}
								searchPlaceholder="Search Category"
								initialLoader="Loading categorys list.."
								react={{
									and: ["RatingsSensor", "PriceRangeSensor"]
								}}
							/>
						</div>
						<div className="">
							<DynamicRangeSlider
								componentId="PriceRangeSensor"
								appbaseField="price"
								title="Price"
								rangeLabels={(min, max) => (
									{
									"start": "$" + min,
									"end": "$"+ max
									}
								)}
								stepValue={1}
								showHistogram={false}
								interval={2}
								initialLoader="Rendering the histogram.."
								react={{
									and: ["CategoryMultilistSensor"]
								}}
							/>
						</div>
						<div className="">
							<MultiList
								componentId="ColorsMultilistSensor"
								appbaseField="attributes.Colors.raw"
								title="Colors"
								size={100}
								sortBy="asc"
								showCount={true}
								showSearch={false}
								searchPlaceholder="Search Colors"
								initialLoader="Loading Colors list.."
							/>
						</div>
						
						{/*<div className="">
							<RatingsFilter
								componentId="RatingsSensor"
								appbaseField="rating"
								title="Avg. Customer Review"
								data={
								[{ start: 4, end: 5, label: "4 & Up" },
								{ start: 3, end: 5, label: "3 & Up" },
								{ start: 2, end: 5, label: "2 & Up" },
								{ start: 1, end: 5, label: "1 & Up" }]
								}
								defaultSelected={{
									"start": 0,
									"end": 5
								}}
								react={{
									and: ["PriceRangeSensor", "CategoryMultilistSensor"]
								}}
							/>
						</div>*/}
						
					</div>
					</div>
					<div className="col s9">
						<ResultCard
							componentId="SearchResult"
							appbaseField="title"
							from={0}
							size={20}
							onData={this.onData}
							pagination={true}
							sortOptions={[
									{
											label: "Lowest Price First",
											appbaseField: "price",
											sortBy: "asc"
									},
									{
											label: "Highest Price First",
											appbaseField: "price",
											sortBy: "desc"
									}
							]}
							react={{
									and: ["SearchSensor","PriceRangeSensor","CategoryMultilistSensor","ColorsMultilistSensor"]
							}}
						/>
					</div>
				</div>
			</ReactiveBase>
		);
	}
}

HelloWorld.defaultProps = {
	mapping: {
		title : "title",
		category: "brand.raw"
	}
};

ReactDom.render(<HelloWorld />, document.getElementById('app'));
