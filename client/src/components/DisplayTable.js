import React from "react";
import styles from './styles/displayTable.module.css';

const DisplayTable = (data) => {

  if (data.tickets == null || data.tickets.length == 0){
    return (
      <div className="container-sm">
        <br />
        <div className="row">
          <p>L O A D I N G</p>
          <div className={styles.loader}>
            <ul>
              <li></li>
              <li></li>
              <li></li>
            </ul>
            <div className={`${styles.wineglass} ${styles.wine_left}`}>
              <div className={styles.wine_top}></div>
            </div>
            <div className={`${styles.wineglass} ${styles.wine_right}`}>
              <div className={styles.wine_top}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  else{
    return (
      <div className="container-sm">
        <h3>Tickets</h3>
        <br />
        <a className={styles.shop} href={data.website} target="_blank">
                  click me to find tickets
                </a>
        <br />
        <br />
        <div className="row">
          {ticketContainer(data.tickets)}
        </div>
      </div>
    );

  }

  
}

function ticketContainer(props) {

  const colors = ['hsl(176, 52%, 80%)', 'hsl(284, 57%, 80%)', 'hsl(20, 49%, 80%)']

  return props.map((currentTicket, index) => {

    var imageURL;
    try {
      imageURL = currentTicket.top_tracks[0].album.images[1].url;
    }
    catch {
      //TODO: find generic image
      imageURL = " ";
    }

    return (
      <div key={currentTicket._id} className="col">
      <Ticket
        ticket={currentTicket}
        image={imageURL}
        bgcolor = {colors[index % colors.length]}
        key={currentTicket._id}
      />
      </div>
    );

  });

}


const Ticket = (props) => (

  <div className={styles.ticketContainer} style={{backgroundColor: props.bgcolor}}>

    <div className={styles.left}>
      <img src={props.image} width="120" height="120" className={styles.img}></img>
    </div>

    <div className={styles.right}>
      <div className={styles.rows}>
      <p className={styles.band}>{props.ticket.ticket_band}</p>
        <p className={styles.info}>{props.ticket.ticket_date}</p>
        <p className={styles.info}>{props.ticket.ticket_price}</p>
        <p className={styles.info}><a href={props.ticket.link} target="_blank">spotify</a></p>
      </div>
    </div>
  </div>
);

export default DisplayTable;