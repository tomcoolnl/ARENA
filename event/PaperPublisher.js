
PaperPublisher = function PaperPublisher() { };

PaperPublisher.extends(EventPublisher);

PaperPublisher.prototype.daily = function () {
    this.publish("big news today");
};

PaperPublisher.prototype.monthly = function () {
    this.publish("interesting analysis", "monthly");
};