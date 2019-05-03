<style>
.top-buffer { margin-top:20px; }

.LineItemHeader{
	background: #178caf;
    color: #fff;
    padding: 5px 0;
}

.lineItem.row {
    margin-top: 5px;
}

.input-group {
    margin-top: 13px;
}
.gridTable div{
line-height:0;
    height: 23px;
}
.balance-due{
    background: #948b8b;
    color: #fff;
    padding: 2px 10px;
}
</style>
<script src="https://unpkg.com/react@16/umd/react.development.js" crossorigin></script>
<script src="https://unpkg.com/react-dom@16/umd/react-dom.development.js" crossorigin></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>

<div id="invoice-app" class="invoice-app"></div>

<script type="text/babel">


class InvoiceApp extends React.Component {

	locale = 'en-US'
	currency = 'USD'
	
	constructor(props) {
		super(props);
	}
	state = {
		taxRate: 0.00,
		discount: 0.00,
		shipping: 0.00,
		amountPaid:0.00,
		items:[
			{
				index: 0,      // react-beautiful-dnd unique key
				name: '',
				quantity: 0,
				price: 0.00,
			}
		],
		amountPaid:0.00
	}
  
	handleTaxChange = (event) => {	
		this.setState({'taxRate': event.target.value})
	}
	handleDiscountChange = (event) => {		
		this.setState({'discount': event.target.value})
	}
	
	handleShippingChange = (event) => {		
		this.setState({'shipping': event.target.value})
	}
	
	amountPaidChange = () =>{
		this.setState({'amountPaid': event.target.value})
	}
	
	handleInvoiceChange = (event) => {
		//this.setState({[event.target.name]: event.target.value})
		this.setState({'taxRate': event.target.value})
	}

	handleLineItemChange = (elementIndex) => (event) => {
		let items = this.state.items.map((item, i) => {
		  if (elementIndex !== i) return item
		  return {...item, [event.target.name]: event.target.value}
		})
		this.setState({items})
	}

	handleAddLineItem = (event) => {
		this.setState({
		  items: this.state.items.concat(
			[{ index: 1, name: '', quantity: 0, price: 0.00 }]
		  )
		})
	}

	handleRemoveLineItem = (elementIndex) => (event) => {
		this.setState({
		  items: this.state.items.filter((item, i) => {
			return elementIndex !== i
		  })
		})
	}



	handleFocusSelect = (event) => {
		event.target.select()
	}

	formatCurrency = (amount) => {
		return (new Intl.NumberFormat(this.locale, {
		  style: 'currency',
		  currency: this.currency,
		  minimumFractionDigits: 2,
		  maximumFractionDigits: 2
		}).format(amount))
	}

	calcTaxAmount = (c) => {
		return c * (this.state.taxRate / 100)
	}

	calcLineItemsTotal = () => {
		return this.state.items.reduce((prev, cur) => (prev + (cur.quantity * cur.price)), 0);
	}
	
	calcSubTotal = () => {
		return this.calcLineItemsTotal()-this.state.discount;
	}


	calcTaxTotal = () => {
		return this.calcSubTotal() * (this.state.taxRate / 100)
	}
	
	calcShipping = () => {
		return parseFloat(this.state.shipping);
	}

	calcGrandTotal = () => {
		return this.calcSubTotal() + this.calcTaxTotal() + this.calcShipping();
	}
	
	calcBalanceDue = () => {
		return this.calcGrandTotal() - this.state.amountPaid;
	}
	
  render() {
    return (
      <div className="invoice">
			<div className="row">
				<div className="Card col-md-4">
				  <?php echo $this->Html->image('encore-logo.png') ?>
				</div>
				<div className="col-md-4">
				</div>
				<div className="col-md-4 a-right">
					<h1>INVOICE</h1>
					<div className="input-group">
						<span className="input-group-addon">#</span>
						<span className="form-control invoice-id" value="{this.props.invoiceid}">{this.props.invoiceid}</span>
					</div>
				</div>
			</div>
			<div className="row top-buffer">
				<div className="col-md-4">
					<textarea id="address" className="form-control" placeholder="Who is this invoice from?"></textarea>
				</div>
				<div className="col-md-4">
				</div>
				<div className="col-md-4">
				<div className="input-group">
						<span className="input-label">Date</span>
						<input type="text" className="form-control datepicker"/>
					</div>
					<div className="input-group">
						<span className="input-label">Due Date</span>
						<input type="text" className="form-control datepicker"/>
					</div>
					<div className="input-group balance-due">
						<span className="input-label">Balance Due : </span>
						<span className="input-label">{this.formatCurrency(this.calcBalanceDue())}</span>
					</div>
				</div>
			</div>
			<div className="row top-buffer">
				<div className="field col-md-4">
					<input className="input-label form-control" placeholder="Bill To(Name)"/>
				</div>
			</div>
			<div className="row">
				<div className="col-md-4">
					<textarea className="form-control" placeholder="Bill To(Address)"></textarea>
				</div>
			</div>
			
			<div className="row top-buffer LineItemHeader">
				<form id="LineItemForm">
					<div className="lineItems">
						<div className="gridTable">
							<div className="col-md-5">
								<div className="input-group">
									<div>Item</div>
								</div>
							</div>
							<div className="col-md-2">
								<div className="input-group">
										<div>Qty</div>
								</div>
							</div>
							<div className="col-md-2">
								<div className="input-group">
										<div>Price</div>
								</div>
							</div>
							<div className="col-md-2">
								<div className="input-group">
									<div>Total</div>
								</div>
							</div>
							<div className="col-md-1">
								<div className="input-group">
									
								</div>
							</div>
						</div>
					</div>
			</form>
			
			</div>
			
			 {this.state.items.map((item, index) => (
			 
			       <div className="lineItem row" key={index}>
						<div className="col-md-5"><input name="name" className="form-control" type="text" value={item.name} onChange={this.handleLineItemChange(index)} /></div>
						<div className="quantity col-md-2"><input className="form-control" name="quantity" type="number" step="1" value={item.quantity} onChange={this.handleLineItemChange(index)} onFocus={this.handleFocusSelect} /></div>
						<div className="currency col-md-2"><input name="price"  className="form-control" type="number" step="0.01" min="0.00" max="9999999.99" value={item.price} onChange={this.handleLineItemChange(index)} onFocus={this.handleFocusSelect} /></div>
						<div className="currency col-md-2">{this.formatCurrency(item.quantity * item.price )}</div>
						<div className="col-md-1">
							<button type="button" className="deleteItem btn btn-xs btn-danger" onClick={this.handleRemoveLineItem(index)}><i className="fa fa-times"></i> </button>
						</div>
				  </div>
			   
			 ))}  
			 
			<div className="row top-buffer">
				<div className="addItem">
					<button className="button btn-primary" onClick={this.handleAddLineItem}><i className="fa fa-plus"></i> Add Item</button>
				</div>
		  </div>
		  
		  <div className="row top-buffer">
			<div className="col-md-9"></div>
			<div className="col-md-3 total">
				
				<div className="input-group">
					<span className="input-label">Discounts</span>
					<input type="text" className="form-control" value={this.state.discount} onChange={this.handleDiscountChange} onFocus={this.handleFocusSelect}/>
				</div>
				<div className="input-group">
					<span className="input-label">Subtotal : </span>
					<span className="input-label">{this.formatCurrency(this.calcSubTotal())}</span>
				</div>
				<div className="input-group">
					<span className="input-label">Tax(%)</span>
					<input type="text" className="form-control" value={this.state.taxRate} onChange={this.handleTaxChange} onFocus={this.handleFocusSelect}/>
				</div>
				<div className="input-group">
					<span className="input-label">Shipping</span>
					<input type="text" className="form-control" value={this.state.shipping} onChange={this.handleShippingChange} onFocus={this.handleFocusSelect}/>
				</div>
				<div className="input-group">
					<span className="input-label">Total : </span>
					<span className="input-label">{this.formatCurrency(this.calcGrandTotal())}</span>
				</div>
				
				<div className="input-group">
					<span className="input-label">Amount Paid</span>
					<input type="text" className="form-control"  value={this.state.amountPaid} onChange={this.amountPaidChange} onFocus={this.handleFocusSelect}/>
				</div>
			</div>
		  </div>
		   <div className="row top-buffer">
				<div className="col-md-9">
				<textarea className="notes form-control" placeholder="Notes - any relevant information not already covered" ></textarea>
			  </div>
		  </div>
		     <div className="row top-buffer">
				<div className="col-md-9">
				<textarea className="terms form-control" placeholder="Terms and conditions - late fees, payment methods, delivery schedule" ></textarea>
			  </div>
		  </div>

      </div>
    );
  }
}

ReactDOM.render(<InvoiceApp invoiceid="100001"/>,document.getElementById('invoice-app'));

</script>
