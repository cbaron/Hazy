module.exports = ( p ) =>  {
    const selectCaret = p.GetIcon('caret-down')
    const shirts = p.meta.shirtSizes.map( ss => `<option value="${ss.value}">${ss.label}</option>` ).join('')
    const ace = p.meta.aceOptions.map( option => `<option value="${option.value}">${option.label}</option>` ).join('')
    const discs = p.meta.discs.map( option => `<option value="${option.value}">${option.label}</option>` ).join('')
    const playerFields = no =>
        `<div class="player">` +
            `<div>Player ${no}</div>` +
            `<input data-js="name${no}" type="text" placeholder="Name" />` + 
            `<div class="select-wrap">` +
                `<select data-js="shirtSize${no}">` +
                    `<option value="null">Shirt Size</option>` + shirts +
                `</select>${selectCaret}` +
            `</div>` +
            `<div class="select-wrap">` +
                `<select data-js="ace${no}">` +
                    `<option value="null">Ace Fund</option>` + ace +
                `</select>${selectCaret}` +
            `</div>` +
            `<div class="select-wrap">` +
                `<select data-js="disc${no}">` +
                    `<option value="null">Would like a...</option>` + discs +
                `</select>${selectCaret}` +
            `</div>` +
            `<input data-js="weight${no}" placeholder="My preferred weight is" />` +
        `</div>`
         
    return `` +
`<section>
  <div class="featured-event">
    <img src="${p.ImageSrc('discs-in-basket.jpg')}"/>
    <div class="content">
        <div class="center">BYOP</div>
    </div>
  </div>
  <div class="event-info">
      <section class="important-info">
          <h4>Join us for the 16th Annual Hazy Shade BYOP Doubles Tournament</h4>
          <div>
            <span>Sponsored by</span>
            <a href="https://www.sprint.com" target="_blank">Sprint</a>,
            <a href="http://www.innovadiscs.com" target="_blank">Innova</a>,
            <span>and</span>
            <a href="http://www.discmania.net" target="_blank">Discmania</a>
          </div>
          <div>
              <span>Belmont Park and Belmont Park West, August 11th-13th, 2017</span>
              <a href="${p.ImageSrc('byop-map.pdf')}" target="_blank">Map</a>
          </div>
      </section>
      <ol class="dates">
        <li>Friday August 11th: Belmont West preview round and Players Party at Hazy Shade in Dayton</li>
        <li>Saturday August 12th: Rec and Intermediate Divisions</li>
        <li>Sunday August 13th: All remaining Divisions</li>
      </ol>
      <ul class="detailed-info">
        <li>
            <div>Check-In</div>
            <p>Player check-in and Players Pack pick-up starts at 12pm, Friday, August 11th, at Hazy Shade’s Dayton location (723 Watervliet Ave). Players who check-in Friday will not need to check-in Saturday or Sunday before the round. Players who have not checked-in on Friday can do so on the day of their Division's event, starting at 8am. A players meeting will be held August 12th and 13th at 9:15am before tee-off at 9:30am.</p>
            <p>The event will feature two rounds of best-shot doubles: one at Belmont, and one at Belmont West.</p>
        </li>
        <li>
            <div>Players Party</div>
            <p>Don't miss our Friday Night Players Party! It's a chance to have a great time with fellow golfers and win prizes with raffle tickets included with registration.</p>
        </li>
        <li>
            <div>Players Pack</div>
            <p>With help from our friends at Innova and Discmania all amateur divisions will receive an amazing Players Pack. Pro divisions will receive a reduced pack and cash payout.</p>
        </li>
        <li>
            <div>Register Today!</div>
            <p>The BYOP event can accommodate 108 teams per day and normally sells out. If you have any questions email us at sales@hazyshade.com.</p>
            <p>
                <span>See the</span>
                <span data-js="playersPageLink" class="link">BYOP Players Page</span>
                <span>to see who is currently registered in each division</span>
            </p>
            <p>
                <span>Checkout last year's results</span>
                <span data-js="lastYearResults" class="link">here.</span>
            </p>
        </li>
      </ul>
  </div>
  <div class="registration">
      <h3>Registration</h3>
      <div class="sub-heading">Enter your information below.</div>
      <div class="info">Recreation and Intermediate divisions will play on August 12th.  All other divisions will play August 13th. There must be 3 teams to make a division. If you sign up for a division that is too small you will have the option to move to another division.</div>
      <div class="division">
          <div class="select-wrap">
              <select data-js="divisionId">
                <option value="null">Division</option>
              </select>
              ${selectCaret}
          </div>
          <div class="spots-left" data-js="spotsLeft"></div>
      </div>
      <div class="players">
          ${playerFields('1')}  
          ${playerFields('2')}
          <div class="info">$5 per player for entry into the ace fund. You can pass for now and still enter your team on the day of the event.</div>
          <div class="info">We will do our best to match disc weight requests but can not guarantee we can get exactly what you asked for.</div>
      </div>
      <div class="contact">
          <div>Contact</div>
          <div class="info">We will not release your info to anyone.  Contact information will only be used for us to reach you for purposes related to the BYOP event.</div>
          <input data-js="email" type="text" placeholder="Email" />
          <input data-js="phone" type="text" placeholder="Phone Number" />
      </div>
      <div class="donation">
          <div>Belmont Basket Donation</div>
          <div class="info">Consider making a donation to replace the baskets at belmont park.  Enter a dollar amount below.</div>
          <input data-js="belmontDonation" type="text" placeholder="5" />
      </div>
      <div data-js="payment" class="payment-info">
          <div>Payment Info</div>
          <div class="info">We only accept credit, debit cards for online registration.  A $3.50 fee will be added to the cost.  You can also pay in cash in one of our stores.</div>
          <input data-js="ccName" type="text" placeholder="Name on Card" />
          <input data-js="ccNo" type="text" placeholder="Number on Card" />
          <div class="exp-ccv">
            <div>
                <div>Expiration</div>
                <div>
                    <div class="exp">
                        <div class="select-wrap">
                            <select data-js="ccMonth">
                                <option value="null">MO</option>
                                <option value="1">01</option>
                                <option value="2">02</option>
                                <option value="3">03</option>
                                <option value="4">04</option>
                                <option value="5">05</option>
                                <option value="6">06</option>
                                <option value="7">07</option>
                                <option value="8">08</option>
                                <option value="9">09</option>
                                <option value="10">10</option>
                                <option value="11">11</option>
                                <option value="12">12</option>
                            </select>
                            ${selectCaret}
                        </div>
                        <div class="select-wrap">
                            <select data-js="ccYear">
                                <option value="null">YR</option>
                                <option value="2017">2017</option>
                                <option value="2018">2018</option>
                                <option value="2019">2019</option>
                                <option value="2020">2020</option>
                                <option value="2021">2021</option>
                                <option value="2022">2022</option>
                                <option value="2023">2023</option>
                            </select>
                            ${selectCaret}
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <div>CVC</div>
                <input data-js="cvc" type="text" />
            </div>
          </div>
      </div>
      <div data-js="totalWrap" class="total side-by-side">
          <span>Total:</span>
          <span data-js="total">${p.Currency.format(p.model.total)}</span>
      </div>
      <div>
          <button data-js="submitBtn" type="button">Submit</button>
      </div>
  </div>
  <div data-view="byopSponsors"></div>
</section>`
}
