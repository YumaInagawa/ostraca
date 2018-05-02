class CreateContents < ActiveRecord::Migration
  def change
    create_table :contents do |t|
      t.string :upload_file_name
      t.binary :upload_file

      t.timestamps
    end
  end
  # def import_csv(csv_file)
  #
  #   csv_text = csv_file.read
  # end
  # CSV.foreach(file.path, headers: true) do |row|
  #
  #     obj = new
  #     obj.attributes = row.to_hash.slice(*updatable_attributes)
  #
  #     obj.save!
  #   end
end
# 今は使ってない
