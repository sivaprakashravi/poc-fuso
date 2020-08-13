import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {
  qa = [{
    topic: 'Claim',
    active: true,
    subs: [{
      q: 'How can I raise a claim?',
      // tslint:disable-next-line:max-line-length
      a: '1. Vist the D2S portal and sign in using your desiganted FUSO User ID.\n 2. Select the "Submit Claim" app box.\n 3. Enter the correct commercial invoice number. You can also use the dropdown menu.\n 4. Select the relevant part number fo your claim.\n 5. Input the quantity you want to submit a claim for.\n 6. Select a claim reason from the dropdown menu.\n 7. Use the "Simulate" button to go to the next screen.\n 8. The list shows you all the parts you want to submit a claim for.\n  9. Please attach the right documents for either damaged or wrong parts shipments.\n 10. Describe your claim in the "Remark" column for each line of claims.\n 11. Selecte "Create". A claim order number of format 40000XXX will be created. Please use this number for further comunication.\n 12. Your claim is created and you order management contact person will work on it.'
    },
    {
      q: 'How can I check the status of my claim?',
      // tslint:disable-next-line:max-line-length
      a: '1. Vist the D2S portal and sign in using your desiganted FUSO User ID. \n 2. Select the "Order History" app box. \n 3. The easiest way to check the status is to select "Group 1" option.  \n 4. Enter the date range in which you want to check your claims for and click on the "Go" button. \n 5. The list shows all the claims with status "Approved", "Pending for conformationm" and "In progress".You can download your data by selecting the download icon.  \n 6. If your "Claim credit note number" is of the for 80000XXX it means that your claim was approved by us.The column "Expected payment date" column gives an approximation on the payment date.  \n 7. You will also receive a "Claim credit note memorandum" the day a team member of the Export Oder Management has approved the claim and and the information is transfered to the accounting department.'
    },
    {
      q: 'Why was my claim rejected? ',
      // tslint:disable-next-line:max-line-length
      a: 'Unfortunately we have to reject your claim, if any particular information is missing, which is necessary to approve a claim. Possible reasons can be: \n . Your claim was submitted after 60 days of vessel arrival date. \n . Lack of good quality pictures or no pictures at all. \n . If the remark doesnt explain the reason for your claim submission properly or no remark was given at all.\n  In case of claim rejection we request you to resubmit only, if you have al necessary informatons and documents available. '
    },
    {
      q: 'My payment date passed but I didnt receive a payment?',
      // tslint:disable-next-line:max-line-length
      a: 'We are sorry to hear so. There is only one possible case, if you are not corretly registered in our accounting system. Please contact your order management person in charge for further procedure. '
    }]
  }, {
    topic: 'Order status',
    active: false,
    subs: [{
      q: 'What status do exist?',
      // tslint:disable-next-line:max-line-length
      a: 'We differ between 7 order status: \n 1. Pending: Your order is missing a GD release. \n 2. Backorder: Your order can not be fulfilled within the requested delivery date. \n 3. Packing: Your order is beeing packed for shipment. \n 4. Packed: The order is pakced and is on its way to the forwarders warehouse.  \n 5. Boarding: Your order is currently loaded onto the vessel or aircrasft.  \n 6. Shipped: The order has left Japan and is on its way to the destination.  \n 7. Cancelled: Your order had to be cancelled'
    },
    {
      q: 'Why is my order on status "Backorder"?',
      // tslint:disable-next-line:max-line-length
      a: 'Your order resolving in status "Backorder" can have multiple reasons: \n 1. The ordered material and/or ordered quantity is not on stock in the warehouse and suppliers are not yet ready to supply the wanted part. \n 2. Your ordered material had to be blocked on item or header level.  \n 3. Your order had to be blocked, because the ordered quantity exceeded the usual quantity (spike logic). '
    },
    {
      q: 'Why was my order cancelled?',
      // tslint:disable-next-line:max-line-length
      a: 'Your order resolving in status "Cancelled" can have two reasons: \n 1. You requested a cancellation of your order. Note: Cancellation is only possible as long as allocation has not happened or stock was not specifically ordered for your order. \n 2. The supply of the ordered part is not possible. Please check for an OM-canellation e-mail with reaplcement parts, or for an automated "supply not possible" e-mail.'
    },
    {
      q: 'Which quantity will arrive?',
      // tslint:disable-next-line:max-line-length
      a: '1. Vist the D2S portal and sign in using your desiganted FUSO User ID. \n 2. Select the "Order History" app box. \n 3. After inserting all necessary data (SO Number, Sold-to party, …) the column "Line quantity" will display the quantity that will arrive. '
    }]
  }, {
    topic: 'Order Guidelines',
    active: false,
    subs: [{
      q: 'VOR Order',
      // tslint:disable-next-line:max-line-length
      a: 'VOR stands for Vehicle Off Road. \n Use a VOR order, if your vehicle is not able to operate anymore without the spare part. \n VOR orders are arranged on daily frequency regardless of the ordered volume. \n To place a VOR order you have to select order reason ZE1 in the D2S system. \n If you place your order before 11 am transportation to the airport will happen on same day. \n If you place your order after 11 am transportation to the airport will happen on the next day. \n Lead-time for VOR orders is around 4 working days.'
    },
    {
      q: 'Emergency Order',
      // tslint:disable-next-line:max-line-length
      a: 'Emergency orders are shipped via air on a weekly basis or if aligned in advance on a regular schedule. \n You should choose an emergency order, if the vehicle can still be operated without the spare parts or to recover replenish stocks.  \n Packing will happen within the next 2 working days after the order was created. The average lead-time (order placement to shipment ex-Japan) is around one week.  \n To place an emergency order please chose order reason ZE2 in D2S.'
    },
    {
      q: 'Stock Order',
      // tslint:disable-next-line:max-line-length
      a: 'Stock orders are shipped via sea. \n Use a stock order for replenishment. \n Stock orders have to be planned and place based on parts arrival. On average 2 months after order placement (3 months for Latin markets).  \n Please use order reason ZE3 in D2S to place a stock order.'
    },
    {
      q: 'Campaign Order',
      // tslint:disable-next-line:max-line-length
      a: 'A campaign order is a one-time order with a discount to support a local campaign.  \n Campaign orders have to be planed and place 3 months (4 months for latin markets) prior to the start of the campaign.  \n To place a campaign order please use order reason ZE6 in D2S. '
    }]
  }];
  constructor() { }

  ngOnInit(): void {
  }

}
