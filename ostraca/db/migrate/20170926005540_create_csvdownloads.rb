class CreateCsvdownloads < ActiveRecord::Migration[5.0]
  def change
    create_table :csvdownloads do |t|
      t.string:name
      t.string:attend
      
      t.timestamps
    end
  end
end
