// a rate limiter for number of requests
// its not for something serious
// just learning new things

class Ratelimiter {
  // limit => nb of requests
  // time_ => time is seconds (time_*1000)
  constructor(limit, time_) {
    this.limit = limit;
    this.time_ = time_ * 1000; // store timestamps
    this.client_ids = new Map(); // store the ip via the req
  }
  // id => is the current ip
  canSend(id) {
    const time_now = Date.now();
    if (!this.client_ids.has(id)) {
      this.client_ids.set(id, []);
    }

    const ts = this.client_ids.get(id);

    while (ts.length && ts[0] <= time_now - this.time_) {
      ts.shift();
    }

    if (ts.length < this.limit) {
      ts.push(time_now);
      return true;
    }
    return false;
  }
}
