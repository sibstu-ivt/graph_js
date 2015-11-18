/**
 * Created by numminorihsf on 20.07.15.
 */
function inherit(Child, Parent)
{
  var F = function () { };
  F.prototype = Parent.prototype;

  Child.prototype = new F();
  Child.prototype.constructor = Child;
  Child.super = Parent.prototype;
}